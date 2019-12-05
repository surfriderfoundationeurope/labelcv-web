/**
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import axios, { AxiosInstance } from 'axios';

import ImageDescriptor from '../models/image.descriptor';

class AnnotationService {

    /**
     * Singleton access method.
     *
     * @returns Service instance.
     */
    public static getInstance(): AnnotationService {
        if (!AnnotationService.instance) {
            AnnotationService.instance = new AnnotationService();
        }
        return AnnotationService.instance;
    }

    /** Singleton unique instance. */
    private static instance: AnnotationService;

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

}

// Export singleton instance.
export const annotationService = AnnotationService.getInstance();
