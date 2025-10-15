import bcrypt from 'bcryptjs';

// Change 'admin123' to whatever password you want to use for the new account
const password = 'admin123';

async function hashPassword() {
    const hash = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hash);
    process.exit();
}

hashPassword();