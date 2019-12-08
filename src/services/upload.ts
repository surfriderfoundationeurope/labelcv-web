/**
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import axios, { AxiosInstance } from 'axios';

import ImageDescriptor from '../models/image/descriptor/image.descriptor';

class UploadService {

    /**
     * Singleton access method.
     *
     * @returns Service instance.
     */
    public static getInstance(): UploadService {
        if (!UploadService.instance) {
            UploadService.instance = new UploadService();
        }
        return UploadService.instance;
    }

    /** Singleton unique instance. */
    private static instance: UploadService;

    /** */
    private http: AxiosInstance;

    /**
     *
     */
    private constructor() {
        // TODO: Check for configuration.
        this.http = axios.create({
            baseURL: `/images`,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * Upload the image denoted by the given descriptor to
     * the backend storage through API.
     * 
     * @param image Descriptor of the image to be uploaded.
     */
    public async upload(image: ImageDescriptor): Promise<void> {
        // Note: Consider monitoring progress ?
    }

}

// Export singleton instance.
export const uploadService = UploadService.getInstance();
