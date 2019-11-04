import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// const secureCompare = require('secure-compare');

// Retrieve email address (user) and password (pass) from function config.
const { user, pass } = functions.config().emailconfig;

// Create transporter instance: secure SMTP connection with provider and authenticate.
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: { user, pass }
});

interface Reminder {
    email: string,
    name: string,
    datetime: string,
    notes: string,
    createdAt: admin.firestore.Timestamp,
    ref: FirebaseFirestore.DocumentReference
};


export const checkReminders = functions.region('europe-west2').pubsub.schedule('every 1 minutes')
    .onRun(async context => {

        // export const checkReminders = functions.region('europe-west2').https.onRequest(
        //     async (req, resp) => {

        // !Ensure request is authentic!
        // const { key } = req.query;
        // if (!secureCompare(key, functions.config().cron.key)) {
        //     resp.status(403).send('permission denied: Security key invalid');
        //     throw new functions.https.HttpsError('permission-denied', 'Security key invalid');
        // }

        const nowAsDate = new Date();
        nowAsDate.setSeconds(0);
        nowAsDate.setMilliseconds(0);
        const now = nowAsDate.toISOString();

        const matches = (await admin.firestore().collection('reminders').where('datetime', '==', now).get())
            .docs.map(d => ({ ...d.data(), ref: d.ref }) as Reminder);

        if (!matches.length) return null;

        for (const { email, name, datetime, notes, createdAt, ref } of matches) {
            await transporter.sendMail({
                from: 'The Reminder App <reminders@thereminderapp.com>',
                subject: `About that reminder you requested...`,
                to: email,
                priority: 'high',
                html: `
                    <p>Hi ${ name},</p>
    
                    <h3>Now is the time. Whatever you needed to do, now might be good idea.</h3>
    
                    <p>
                        <strong>Notes:</strong>
                        <br>
                        <span>${ notes}</span>
                    </p>
    
                    <br>
                    <br>
                    <span style="font-size:0.8em;font-style:italic">Reminder created: ${ createdAt.toDate().toLocaleDateString()}</span>
                    <br>
                    <span style="font-size:0.8em;font-style:italic">Reminder time: ${ new Date(datetime).toLocaleDateString()}</span>
                    `
            });
            await ref.delete();
        }

        return 'success';
    });