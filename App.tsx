import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { Spinner } from './components/Spinner';
import { generatePromptFromImage } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedPrompt('');
      setError(null);
    } else {
      setError('Please upload a valid image file.');
    }
  }, []);

  const handleGeneratePrompt = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      const prompt = await generatePromptFromImage(imageFile);
      setGeneratedPrompt(prompt);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate prompt. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleReset = useCallback(() => {
    setImageFile(null);
    setImageUrl(null);
    setGeneratedPrompt('');
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <Header />
      <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col lg:flex-row gap-8 mt-8">
        {/* Left Panel: Image Uploader / Preview */}
        <div className="lg:w-1/2 flex flex-col bg-slate-900/30 rounded-2xl border border-white/20 shadow-2xl shadow-black/40">
          {!imageUrl ? (
            <ImageUploader onImageUpload={handleImageUpload} isProcessing={isLoading} />
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-full">
              <div className="w-full aspect-square max-h-[60vh] lg:max-h-full rounded-lg overflow-hidden border-2 border-slate-600 relative group">
                <img
                  src={imageUrl}
                  alt="Uploaded preview"
                  className="w-full h-full object-contain"
                />
                 <button
                  onClick={handleReset}
                  className="absolute top-3 right-3 bg-slate-900/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
                  aria-label="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Actions and Results */}
        <div className="lg:w-1/2 flex flex-col space-y-6">
          <div className="flex-grow flex flex-col justify-center items-center bg-slate-900/30 rounded-2xl border border-white/20 p-6 shadow-2xl shadow-black/40 min-h-[300px] lg:min-h-full">
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <div className="text-center text-red-400">
                <h3 className="text-lg font-semibold mb-2">An Error Occurred</h3>
                <p>{error}</p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : generatedPrompt ? (
              <PromptDisplay prompt={generatedPrompt} />
            ) : (
              <div className="text-center text-slate-400">
                {imageUrl ? (
                  <>
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">Ready to Generate</h2>
                    <p className="mb-6">Click the button below to generate a detailed prompt for your image.</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">Awaiting Image</h2>
                    <p>Upload an image to get started.</p>
                  </>
                )}
              </div>
            )}
          </div>

          {imageUrl && (
            <div className="flex-shrink-0">
              <button
                onClick={handleGeneratePrompt}
                disabled={isLoading || !!generatedPrompt}
                className="w-full flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
              >
                <SparklesIcon className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Generating...' : 'Generate Prompt'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;