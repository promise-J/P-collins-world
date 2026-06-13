import { EmailService } from "./email.service"

const emailService = new EmailService()

export interface BaseEmailOptions {
    to: string;
    subject: string;
    html: string;
}

const emailTemplates = {
    sendVerificationEmail: (options: BaseEmailOptions) => options,
    welcomeEmail: (options: BaseEmailOptions) => options,
    forgotPasswordEmail: (options: BaseEmailOptions) => options,
    resendVerificationEmail: (options: BaseEmailOptions) => options,
}

export type EmailActionName = keyof typeof emailTemplates;

export interface EmailActionPayload<T extends EmailActionName> {
    action: T;
    options: BaseEmailOptions;
}

export const emailAction = async <T extends EmailActionName>({ action, options }: EmailActionPayload<T>) => {
    try {
        const templateBuilder = emailTemplates[action];

        if (!templateBuilder) {
            throw new Error(`Email action "${action}" does not exist.`);
        }

        // 3. Centralize the single execution call routine here 
        const readyOptions = templateBuilder(options);
        
        await emailService.sendEmail(
            readyOptions.to, 
            readyOptions.subject, 
            readyOptions.html
        );
        
    } catch (error) {
        console.error(`Failed to execute email action [${action}]:`, error);
        throw error;
    }
}
