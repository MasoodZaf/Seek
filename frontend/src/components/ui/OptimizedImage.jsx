import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from 'react-intersection-observer';

/**
 * OptimizedImage component with lazy loading and next-gen format support
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : null);
  const imgRef = useRef(null);

  // Intersection observer for lazy loading
  const { ref: intersectionRef, inView } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority // Skip lazy loading for priority images
  });

  // Generate WebP and AVIF sources if supported
  const generateSources = (originalSrc) => {
    if (!originalSrc) return [];
    
    const sources = [];
    const basePath = originalSrc.split('.').slice(0, -1).join('.');
    
    // Check if browser supports AVIF
    if (supportsFormat('avif')) {
      sources.push({
        srcSet: `${basePath}.avif`,
        type: 'image/avif'
      });
    }
    
    // Check if browser supports WebP
    if (supportsFormat('webp')) {
      sources.push({
        srcSet: `${basePath}.webp`,
        type: 'image/webp'
      });
    }
    
    return sources;
  };

  // Check format support
  const supportsFormat = (format) => {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
    } catch {
      return false;
    }
  };

  // Load image when in view or priority
  useEffect(() => {
    if ((inView || priority) && src && !currentSrc) {
      setCurrentSrc(src);
    }
  }, [inView, priority, src, currentSrc]);

  // Handle image load
  const handleLoad = (event) => {
    setIsLoaded(true);
    onLoad?.(event);
  };

  // Handle image error
  const handleError = (event) => {
    setHasError(true);
    onError?.(event);
  };

  // Generate blur placeholder
  const generateBlurPlaceholder = () => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 10, 10);
    return canvas.toDataURL();
  };

  // Combine refs
  const setRefs = (element) => {
    imgRef.current = element;
    intersectionRef(element);
  };

  const sources = generateSources(currentSrc);
  const showPlaceholder = placeholder === 'blur' && !isLoaded && !hasError;
  const placeholderSrc = showPlaceholder ? generateBlurPlaceholder() : null;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {showPlaceholder && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
          style={{
            opacity: isLoaded ? 0 : 1
          }}
        />
      )}
      
      {/* Loading skeleton */}
      {!currentSrc && !priority && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image failed to load</p>
          </div>
        </div>
      )}
      
      {/* Main image */}
      {currentSrc && !hasError && (
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              type={source.type}
              sizes={sizes}
            />
          ))}
          <img
            ref={setRefs}
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...props}
          />
        </picture>
      )}
    </div>
  );
};

// Higher-order component for image optimization
export const withImageOptimization = (Component) => {
  return React.forwardRef((props, ref) => {
    const optimizedProps = {
      ...props,
      // Convert img elements to OptimizedImage
      children: React.Children.map(props.children, (child) => {
        if (React.isValidElement(child) && child.type === 'img') {
          return (
            <OptimizedImage
              {...child.props}
              ref={ref}
            />
          );
        }
        return child;
      })
    };
    
    return <Component {...optimizedProps} />;
  });
};

// Hook for preloading images
export const useImagePreload = (src, priority = false) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src || !priority) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority]);

  return { isLoaded, hasError };
};

export default OptimizedImage;