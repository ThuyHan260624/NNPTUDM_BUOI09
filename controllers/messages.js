const Message = require('../schemas/messages');
const mongoose = require('mongoose');

module.exports = {
    getMessagesWithUser: async (req, res) => {
        try {
            const currentUserID = req.userId; // Được gán từ middleware authHandler
            const targetUserID = req.params.userID;

            if (!mongoose.Types.ObjectId.isValid(targetUserID)) {
                return res.status(400).send({ message: "ID người dùng không hợp lệ" });
            }

            const messages = await Message.find({
                $or: [
                    { from: currentUserID, to: targetUserID },
                    { from: targetUserID, to: currentUserID }
                ]
            }).sort({ createdAt: 1 }); // Xếp từ cũ nhất tới mới nhất

            res.status(200).send(messages);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    sendMessage: async (req, res) => {
        try {
            const currentUserID = req.userId;
            const targetUserID = req.body.to;

            if (!mongoose.Types.ObjectId.isValid(targetUserID)) {
                return res.status(400).send({ message: "ID người nhận không hợp lệ" });
            }

            let type = 'text';
            let text = req.body.text;

            if (req.file) {
                type = 'file';
                text = req.file.path.replace(/\\/g, '/'); // Lưu đường dẫn tương thích mọi OS
            }

            if (!text) {
                return res.status(400).send({ message: "Nội dung tin nhắn không được để trống" });
            }

            const newMessage = new Message({
                from: currentUserID,
                to: targetUserID,
                messageContent: {
                    type: type,
                    text: text
                }
            });

            const savedMessage = await newMessage.save();
            res.status(201).send(savedMessage);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    getLastMessages: async (req, res) => {
        try {
            const currentUserID = new mongoose.Types.ObjectId(req.userId);

            const lastMessages = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { from: currentUserID },
                            { to: currentUserID }
                        ]
                    }
                },
                {
                    $sort: {
                        createdAt: -1 // Xếp từ mới nhất tới cũ nhất
                    }
                },
                {
                    $addFields: {
                        partnerId: {
                            $cond: {
                                if: { $eq: ["$from", currentUserID] },
                                then: "$to",
                                else: "$from"
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$partnerId",
                        lastMessage: { $first: "$$ROOT" } // Chọn document đầu tiên mỗi nhóm (mới nhất)
                    }
                },
                {
                    $lookup: {
                        from: "users", 
                        localField: "_id",
                        foreignField: "_id",
                        as: "partnerInfo"
                    }
                },
                {
                    $unwind: {
                        path: "$partnerInfo",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        "partnerInfo.password": 0, // Không trả về mật khẩu
                        "partnerInfo.__v": 0
                    }
                },
                {
                    $sort: {
                        "lastMessage.createdAt": -1 // Sắp xếp lại hội thoại mới nổi lên trên
                    }
                }
            ]);

            res.status(200).send(lastMessages);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
};
