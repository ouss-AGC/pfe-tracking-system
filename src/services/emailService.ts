import emailjs from '@emailjs/browser';

// =========================================================================
// EMAILJS CONFIGURATION
// Replace these with your actual EmailJS credentials
// =========================================================================
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_2da0pjn', // Your active Outlook service
    TEMPLATE_BOOKING: '4e5b0vl', // Student -> Supervisor template
    TEMPLATE_RESPONSE: 'nrbytzi', // Supervisor -> Student template
    PUBLIC_KEY: '-6qYfuo6UFFAK_jCf', // Your active Public Key
    SUPERVISOR_EMAIL: 'oussmer@hotmail.fr'
};

export const emailService = {
    /**
     * Notify the supervisor (Dr. Atoui) about a new booking request
     */
    async sendBookingNotification(app: {
        nomEtudiant: string;
        titreProjet: string;
        date: string;
        creneauHoraire: string;
        motif: string;
    }) {
        try {
            const templateParams = {
                to_email: EMAILJS_CONFIG.SUPERVISOR_EMAIL,
                from_name: app.nomEtudiant,
                project_title: app.titreProjet,
                app_date: app.date,
                app_time: app.creneauHoraire,
                app_motif: app.motif,
                reply_to: 'noreply@pfe-tracker.mil'
            };

            console.log('📨 Sending booking notification to supervisor...', templateParams);

            // Note: If PUBLIC_KEY is 'YOUR_PUBLIC_KEY', we just log it for now
            if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                console.warn('⚠️ EmailJS Public Key not set. Email not sent, check console for params.');
                return { status: 'skipped', params: templateParams };
            }

            const result = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_BOOKING,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            return { status: 'success', result };
        } catch (error) {
            console.error('❌ Failed to send booking notification:', error);
            return { status: 'error', error };
        }
    },

    /**
     * Notify the student about the supervisor's decision
     */
    async sendResponseNotification(params: {
        studentEmail: string;
        studentName: string;
        status: string; // 'ACCEPTÉ', 'REFUSÉ', 'REPORTÉ'
        date: string;
        time: string;
        details?: string;
    }) {
        try {
            const templateParams = {
                to_email: params.studentEmail,
                to_name: params.studentName,
                status: params.status,
                app_date: params.date,
                app_time: params.time,
                feedback: params.details || 'Aucun détail supplémentaire.',
                from_name: 'Dr. Oussama Atoui'
            };

            console.log(`📨 Sending response notification (${params.status}) to student...`, templateParams);

            if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                console.warn('⚠️ EmailJS Public Key not set. Email not sent.');
                return { status: 'skipped', params: templateParams };
            }

            const result = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_RESPONSE,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            return { status: 'success', result };
        } catch (error) {
            console.error('❌ Failed to send response notification:', error);
            return { status: 'error', error };
        }
    }
};
