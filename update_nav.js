const fs = require('fs');
const path = require('path');

const directory = 'c:\\Users\\faisal\\.gemini\\my website';
const files = fs.readdirSync(directory);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Mark Web Book in navbar as auth-only if not already marked
        // Look for <li><a href="web-book.html" ...
        content = content.replace(/<li><a href="web-book.html"/g, '<li class="auth-only"><a href="web-book.html"');

        // 2. Add auth-only to restricted sections in virtual-lab.html if not already there (handled manually but good to ensure)
        if (file === 'virtual-lab.html') {
            // Already handled manually, but let's ensure it's robust
        }

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
});
