let crypto = require('crypto')

/**
 * Random password dam bao du manh:
 * - co chu hoa (A-Z)
 * - co chu thuong (a-z)
 * - co so (0-9)
 * - co ki tu dac biet (!@#$...)
 * - tong cong = length ki tu
 */
function generateRandomPassword(length) {
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let lowercase = 'abcdefghijklmnopqrstuvwxyz'
    let numbers = '0123456789'
    let symbols = '!@#$%&*'
    let allChars = uppercase + lowercase + numbers + symbols

    // Dam bao co it nhat 1 ki tu moi loai
    let password = []
    password.push(uppercase[Math.floor(Math.random() * uppercase.length)])
    password.push(lowercase[Math.floor(Math.random() * lowercase.length)])
    password.push(numbers[Math.floor(Math.random() * numbers.length)])
    password.push(symbols[Math.floor(Math.random() * symbols.length)])

    // Random phan con lai
    for (let i = 4; i < length; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)])
    }

    // Xao tron thu tu
    for (let i = password.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]]
    }

    return password.join('')
}

module.exports = {
    generateRandomPassword
}
