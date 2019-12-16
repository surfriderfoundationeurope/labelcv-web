/**
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import axios, { AxiosInstance } from 'axios';

import ImageDescriptor from '@/models/image/descriptor/image.descriptor';
import { AnnotationClass } from '@/models/annotation';

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
            headers: { 'Content-Type': 'application/json' },
        });
    }

    /**
     * @returns URL of the next image to annotate.
     */
    public getNextImageURL(): string {
        // TODO: Call API ENDPOINT.
        return '';
    }

    /**
     *
     */
    public getAnnotationClasses(): AnnotationClass[] {
        return [
            { label: 'Bottle', id: 0 },
            { label: 'Fragment', id: 1 },
            { label: 'Other', id: 2 },
        ];
    }

}

// Export singleton instance.
export const annotationService = AnnotationService.getInstance();
