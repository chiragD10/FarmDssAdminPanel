import { useState } from 'react';
import {
    FacebookShareButton, FacebookIcon,
    TwitterShareButton, TwitterIcon,
    TelegramShareButton, TelegramIcon,
    WhatsappShareButton, WhatsappIcon,
    EmailShareButton, EmailIcon
} from 'react-share';

interface ShareProps {
    setShowShare: (value: boolean) => void;
    shareLink: string
}

export default function Share({ setShowShare, shareLink}: ShareProps) {
    const [link, setLink] = useState(shareLink);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link);
            console.log("Content copied to clipboard");
        } catch (err) {
            console.error("Failed to copy");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50 bg-black">
            <div className="bg-white rounded-lg p-8 w-96">
                <div className="flex justify-between mb-4">
                    <h2 className="text-lg font-semibold">Share</h2>
                    <button onClick={() => setShowShare(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-row justify-between">
                    <FacebookShareButton url={link}>
                        <FacebookIcon size={48} round={true} />
                    </FacebookShareButton>
                    <TwitterShareButton url={link}>
                        <TwitterIcon size={48} round={true} />
                    </TwitterShareButton>
                    <TelegramShareButton url={link}>
                        <TelegramIcon size={48} round={true}></TelegramIcon>
                    </TelegramShareButton>
                    <WhatsappShareButton url={link}>
                        <WhatsappIcon size={48} round={true} />
                    </WhatsappShareButton>
                    <EmailShareButton url={link}>
                        <EmailIcon size={48} round={true}></EmailIcon>
                    </EmailShareButton>
                </div>
                <div className="mt-4">
                    <label htmlFor="webinarLink" className="block text-lg font-medium leading-6 text-gray-900">Webinar Link</label>
                    <input
                        type="text"
                        id="youtubeLink"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Enter YouTube link here"
                        value={link}
                        // onChange={(e) => setYoutubeLink(e.target.value)}
                    />
                </div>
                <button
                    className="mt-6 w-full px-4 py-2 bg-xcodegold text-white rounded focus:outline-none"
                    onClick={copyToClipboard}
                >
                    Copy Link
                </button>
            </div>
        </div>
    );
}
