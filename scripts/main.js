var fs = require('fs');
var nodemailer = require('nodemailer');

const i18n_en = JSON.parse(fs.readFileSync('./i18n/en.json'));
const i18n_fr = JSON.parse(fs.readFileSync('./i18n/fr.json'));
const i18n_de = JSON.parse(fs.readFileSync('./i18n/de.json'));
const i18n_nl = JSON.parse(fs.readFileSync('./i18n/nl.json'));
const i18n_it = JSON.parse(fs.readFileSync('./i18n/it.json'));
const i18n_es = JSON.parse(fs.readFileSync('./i18n/es.json'));

const MAIL_USER = '';
const MAIL_PASSWORD = '';

function diff(source, target) {
    return Object.keys(source).reduce((acc, key) => {
        if (target.hasOwnProperty(key)) {
            return acc;
        }
        return {
            ...acc,
            [key]: source[key]
        };
    }, {});
}


function getTableRows(diffObj) {
    var rows = Object.keys(diffObj).map((key) => {
        return `
        <tr style="border: 1px solid #ccc">
            <td style="border: 1px solid #ccc; text-align:left">${key}</td>
            <td style="border: 1px solid #ccc; text-align:left">${diffObj[key]}</td>
            <td style="border: 1px solid #ccc; text-align:left"></td>
        </tr>
        `;
    });

    rows.unshift(`
        <tr style="border: 1px solid #ccc">
            <th style="border: 1px solid #ccc; text-align:left">Keys</th>
            <th style="border: 1px solid #ccc; text-align:left">Original text</th>
            <th style="border: 1px solid #ccc; text-align:left">Translation text</th>
        </tr>
    `);

    return rows.reduce((acc, row) => acc + row, '');
}

function getTable(title, diffObj) {
    return `
        <h3 style="font-weight:bold; font-size:20px">${title}</h3>
        <table style="border: 1px solid #ccc; width:100%">
            <tbody>${getTableRows(diffObj)}</tbody>
        </table>
    `;
}

function getHTML() {
    const diff_en_fr = diff(i18n_en, i18n_fr);
    const diff_en_de = diff(i18n_en, i18n_de);
    const diff_en_nl = diff(i18n_en, i18n_nl);
    const diff_en_it = diff(i18n_en, i18n_it);
    const diff_en_es = diff(i18n_en, i18n_es);

    return [
        getTable('French', diff_en_fr),
        getTable('German', diff_en_de),
        getTable('Dutch', diff_en_nl),
        getTable('Italian', diff_en_it),
        getTable('Spanish', diff_en_es),
    ].reduce((acc, table) => acc + table, '');
}

function write() {
    const diff_en_fr = diff(i18n_en, i18n_fr);
    const diff_en_de = diff(i18n_en, i18n_de);
    const diff_en_nl = diff(i18n_en, i18n_nl);
    const diff_en_it = diff(i18n_en, i18n_it);
    const diff_en_es = diff(i18n_en, i18n_es);

    [
        diff_en_fr,
        diff_en_de,
        diff_en_nl,
        diff_en_it,
        diff_en_es,
    ].forEach((diffObj, index) => fs.writeFile(`${index}.json`, JSON.stringify(diffObj), 'utf8', () => {}));
}

function mail() {
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD
        }
    });

    var options = {
        from: 'bogdan.prisecaru@myskillcamp.com', // Sender address
        to: 'bogdan.prisecaru@myskillcamp.com, dragos.bucan@myskillcamp.com', // List of recipients
        subject: `MySkillCamp - Translations - ${new Date().toDateString()}`, // Subject line
        html: getHTML()
    }

    transport.sendMail(options);
}

mail();
write();
