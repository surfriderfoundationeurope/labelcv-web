/**
 * The ImageProviderService class is a singleton that holds and provides
 * factory method for creating indexed ImageProvider instances.
 *
 * @author Felix Voituret <oss@voituret.fr>
 */

import ImageDescriptor from '../models/image.descriptor';
import ImageProvider from '../models/image.provider';
import DropboxImageProvider from '../models/image.provider.dropbox';
import GoogleDriveImageProvider from '../models/image.provider.gdrive';
import LocalImageProvider from '../models/image.provider.local';

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
        // TODO: Perfoms Google drive and dropbox initialization.
        this.providers.set('Local', this.createLocalImageProvider());
        this.providers.set('Google Drive', this.createLocalImageProvider());
        this.providers.set('Dropbox', this.createLocalImageProvider());
        // Note: add new Provider factory here.
    }

    /**
     * Register each provider to the given container.
     *
     * @see ImageProvider#register
     * @param container Target DOM container to register every provider into.
     */
    public register(container: string): void {
        this.providers.forEach((provider, _) => {
            provider.register(container);
        });
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
