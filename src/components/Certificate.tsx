

interface CertificateProps {
    participantName: string
    eventTitle: string
    eventDate: string
    registrationCode: string
    attendedAt?: number | null
}

export default function Certificate({
    participantName,
    eventTitle,
    eventDate,
    registrationCode,
    attendedAt,
}: CertificateProps) {
    const certificateId = `CERT-${registrationCode.replace('REG-', '')}`
    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div
            id="certificate-content"
            className="bg-white relative overflow-hidden"
            style={{ width: '800px', height: '600px' }}
        >
            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-amber-500 rounded-lg" />
            <div className="absolute inset-6 border-2 border-amber-300 rounded-lg" />

            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-amber-500 rounded-bl-lg" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-amber-500 rounded-br-lg" />

            {/* Content */}
            <div className="relative px-16 py-12 h-full flex flex-col items-center justify-center text-center">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-4xl font-black text-gray-900 tracking-wide">
                        CERTIFICATE
                    </h1>
                    <p className="text-lg text-amber-600 font-semibold tracking-widest mt-1">
                        OF PARTICIPATION
                    </p>
                </div>

                {/* Decorative Line */}
                <div className="w-32 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-full mb-8" />

                {/* Main Text */}
                <p className="text-gray-600 text-lg mb-2">This is to certify that</p>

                <h2 className="text-3xl font-black text-indigo-600 mb-4 px-8 py-2 border-b-2 border-indigo-200">
                    {participantName}
                </h2>

                <p className="text-gray-600 text-lg mb-2">has successfully participated in</p>

                <h3 className="text-2xl font-bold text-gray-900 mb-6 max-w-lg">
                    "{eventTitle}"
                </h3>

                <p className="text-gray-600">
                    held on <span className="font-semibold text-gray-800">{formattedDate}</span>
                </p>

                {/* Seal/Badge */}
                <div className="mt-8 flex items-center gap-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center">
                                <span className="text-white font-black text-xl">CC</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-semibold">CampusConnect</p>
                    </div>

                    <div className="text-left">
                        <div className="border-t-2 border-gray-400 pt-2 w-48">
                            <p className="text-sm font-semibold text-gray-700">Event Organizer</p>
                        </div>
                    </div>
                </div>

                {/* Certificate ID */}
                <div className="absolute bottom-10 left-16 text-xs text-gray-400">
                    Certificate ID: {certificateId}
                </div>

                {/* Verified Date */}
                <div className="absolute bottom-10 right-16 text-xs text-gray-400">
                    {attendedAt && `Verified: ${new Date(attendedAt).toLocaleDateString()}`}
                </div>
            </div>
        </div>
    )
}
