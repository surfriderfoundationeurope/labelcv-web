/**
 * The ImageProviderService class is a singleton that holds and provides
 * factory method for creating indexed ImageProvider instances.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import { ImageDescriptor, ImageProvider } from '../providers/provider';
import LocalImageProvider from '../providers/provider.local';
import DisabledImageProvider from '../providers/provider.disabled';

class ImageProviderService {

    /**
     * Singleton access method.
     *
     * @returns Service instance.
     */
    public static getInstance(): ImageProviderService {
        if (!ImageProviderService.instance) {
            ImageProviderService.instance = new ImageProviderService();
        }
        return ImageProviderService.instance;
    }

    /** Singleton unique instance. */
    private static instance: ImageProviderService;

    /** Image provider instances. */
    private providers: Map<string, ImageProvider<ImageDescriptor>>;

    /**
     * Default service constructor.
     */
    private constructor() {
        this.providers = new Map<string, ImageProvider<ImageDescriptor>>();
        // TODO: Check for key l1on label.
        this.providers.set('Local', this.createLocalImageProvider());
        this.providers.set('Google Drive', new DisabledImageProvider());
        this.providers.set('Dropbox', new DisabledImageProvider());
        // Note: add new Provider factory here.
    }

    /**
     * Available image provider keys getter.
     *
     * @returns List of available image Provider.
     */
    public getAvailableImageProvider(): string[] {
        return Array.from(this.providers.keys());
    }

    /**
     * ImageProvider access method.
     *
     * @param name Name of the Provider to get;
     */
    public getImageProvider(name: string): ImageProvider<ImageDescriptor> | undefined {
        return this.providers.get(name);
    }

    /**
     * Factory method that creates a LocalImageProvider instance.
     *
     * @returns created local image Provider instance.
     */
    private createLocalImageProvider(): LocalImageProvider {
        return new LocalImageProvider();
    }

}

// Export singleton instance.
export const imageProviderService = ImageProviderService.getInstance();
