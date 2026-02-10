import emailjs from '@emailjs/browser';

// =========================================================================
// EMAILJS CONFIGURATION
// =========================================================================
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_2da0pjn',
    TEMPLATE_BOOKING: '4e5b0vl',
    TEMPLATE_RESPONSE: 'nrbytzi',
    PUBLIC_KEY: '-6qYfuo6UFFAK_jCf',
    SUPERVISOR_EMAIL: 'oussmer@hotmail.fr'
};

// Initialize EmailJS immediately
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

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
                name: app.nomEtudiant, // compatibility
                project_title: app.titreProjet,
                app_date: app.date,
                app_time: app.creneauHoraire,
                app_motif: app.motif,
                message: `Nouveau RDV de ${app.nomEtudiant} pour le projet ${app.titreProjet}`,
                reply_to: 'noreply@pfe-tracker.mil'
            };

            console.log('📨 Sending booking notification...', templateParams);

            const result = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_BOOKING,
                templateParams
            );

            console.log('✅ EmailJS Success:', result);
            return { status: 'success', result };
        } catch (error: any) {
            console.error('❌ EmailJS Error:', error);
            // Alert user of error for immediate debugging
            window.alert(`Erreur d'envoi d'email: ${error?.text || error?.message || 'Erreur inconnue'}`);
            return { status: 'error', error };
        }
    },

    /**
     * Notify the student about the supervisor's decision
     */
    async sendResponseNotification(params: {
        studentEmail: string;
        studentName: string;
        status: string;
        date: string;
        time: string;
        details?: string;
    }) {
        try {
            const templateParams = {
                to_email: params.studentEmail,
                email: params.studentEmail, // compatibility
                to_name: params.studentName,
                name: params.studentName, // compatibility
                status: params.status,
                app_date: params.date,
                app_time: params.time,
                feedback: params.details || 'Aucun détail supplémentaire.',
                from_name: 'Dr. Oussama Atoui'
            };

            console.log(`📨 Sending response to ${params.studentEmail}...`, templateParams);

            const result = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_RESPONSE,
                templateParams
            );

            console.log('✅ EmailJS Response Success:', result);
            return { status: 'success', result };
        } catch (error: any) {
            console.error('❌ EmailJS Response Error:', error);
            window.alert(`Erreur d'envoi au student: ${error?.text || error?.message}`);
            return { status: 'error', error };
        }
    }
};
