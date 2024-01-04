const puppeteer = require('puppeteer');
const fs = require('fs');
const { parse } = require('papaparse');
const ext_js = `main();

function main() {
    var p = document.querySelector('[role="list"]').children;
    var k, x;
    for (k = 0; k < p.length; k++) {
        x = p[k].children[0];

        try {
            x = x.children[0].children[1];
            if (x.children[1].getAttribute("role") == "list") {
                x = x.children[1];
                var l = x.childElementCount;
                console.log(x);

                if (l == 1) {
                    x.children[0].childre[0].children[0].click();
                } else if (true) {
                    var select = Math.floor(Math.random() * (l - 1))
                    x.children[select].children[0].children[0].click();
                    select = Math.floor(Math.random() * (l - 1));
                    x.children[select].children[0].children[0].click();
                    select = Math.floor(Math.random() * (l - 1));
                    x.children[select].childre[0].children[0].click();
                }
            } else {
                x = x.children[1].children[0];
                x = x.children[0].children[0].children;
                var select = Math.floor(Math.random() * (x.length - 1))
                x[select].children[0].click();
            }

        } catch (e) {
            null;
        }
    }

    const rates = document.querySelectorAll("[role='radiogroup']");

    rates.forEach(rate => {
        try {
            const children = rate.children;

            if (children.length === 0) {
                return;
            }

            const firstChild = children[0].children;

            if (firstChild.length < 2) {
                return;
            }

            const nestedChildren = firstChild[1].children;

            if (nestedChildren.length < 2) {
                return;
            }

            const randomSelectedChild = Math.floor(Math.random() * (nestedChildren.length - 3)) + 2;
            nestedChildren[randomSelectedChild].click();
        } catch (error) {
            console.error('Error clicking radio group child:', error);
        }
    });
}

`;

const validForm = (form) => {
    return form.includes('forms.gle') || form.includes('docs.google.com/forms/');
};

const getRandomNames = async (n) => {
    return new Promise((resolve, reject) => {
        try {
            const csvFileData = fs.readFileSync('Names.csv', 'utf8');
            const parsedData = parse(csvFileData, { header: true });

            const names = parsedData.data.map(row => row.Name);

            // Shuffle the array and pick the first n names
            const shuffledNames = names.sort(() => Math.random() - 0.5);
            const selectedNames = shuffledNames.slice(0, n);

            resolve(selectedNames);
        } catch (error) {
            reject(error);
        }
    });
};

const main = async (res, form, data, N) => {
    const { names, emails } = data;

    if (!validForm(form)) {
        console.error('Invalid form URL');
        return;
    }

    try {
        N = parseInt(N) || 1;
        if (N > 300) {
            return;
        }
        const NAMES = names === 'DEFAULT'
            ? await getRandomNames(N)
            : [...names.split(',').map(name => name.trim()).slice(0, N), ...await getRandomNames(N - names.split(',').length)];        const EMAILS = (emails === 'DEFAULT' || emails === 'DEFUALT') ? [] : emails.split(',').map(email => email.trim()).slice(0, N);

        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: "/opt/render/project/.render/chrome/opt/google/chrome/chrome",
            args: ['--no-sandbox', '--disable-dev-shm-usage'],
        });
        const page = await browser.newPage();
        for (let i = 0; i < N+4; i++) {
            try {
                console.log(`Submitting form no: ${i + 1}`);
                await page.goto(form);

                let flag1 = false;
                let flag2 = false;
                var textInputs=null;
                var emailInputs=null;
                try {
                    textInputs = await page.$$('input[type="text"]');
                    flag1 = true;
                } catch (error) { }

                try {
                    emailInputs = await page.$$('input[type="email"]');
                    flag2 = true;
                } catch (error) { }

                const NAME = NAMES[i] || 'None';
                const EMAIL = EMAILS[i] || `${NAME.replace(/\s/g, '')}${randint(10, 1000)}@${choose(['gmail', 'yahoo', 'outlook'])}${choose(['.com', '.in'])}`;

                if (flag1) {
                    for (let i = 0; i < textInputs.length; i++) {
                        const input = textInputs[i];
                        const inputName = i === 0 ? toTitleCase(NAME) : "None";

                        await input.type(inputName, { delay: 10 });

                        // Press 'Enter' only for the first input
                        if (i === 0) {
                            await input.press('Enter');
                        }
                    }
                }

                if (flag2) {
                    for (const input of emailInputs) {
                        await input.type(EMAIL, { delay: 10 });
                        await input.press('Enter');
                    }
                }
                await page.evaluate(ext_js);
                await new Promise(resolve => setTimeout(resolve, 250));
                await page.evaluate(() => {
                    document.forms[0].submit();
                });
                await new Promise(resolve => setTimeout(resolve,300));
                
            } catch (error) {
                console.error('Error filling form:', error);
                i--;
            }
        }

        await browser.close();
    } catch (error) {
        console.error('Error in main function:', error);
    }
};

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choose(options) {
    return options[Math.floor(Math.random() * options.length)];
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

module.exports = { main,validForm };
