'use client';

import React from 'react';

interface DigitalContractProps {
  contractId: string;
  performerName: string;
  performerEntity?: string;
  seekerName: string;
  seekerEntity?: string;
  venueName: string;
  venueAddress: string;
  eventDate: string;
  callTime: string;
  startTime: string;
  endTime: string;
  acts: string[];
  totalFee: number;
  currency: string;
  technicalRider: {
    stage: string;
    audio: string;
    lighting: string;
    hospitality: string;
  };
  cues: { timestamp: string; action: string }[];
  status: 'draft' | 'active' | 'completed' | 'disputed';
  acceptedAt?: string;
}

export const DigitalContractView: React.FC<DigitalContractProps> = (props) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 border border-gray-200 shadow-xl font-serif leading-relaxed">
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-widest">Digital Performance Agreement</h1>
        <p className="text-sm font-mono mt-2">Contract ID: #{props.contractId}</p>
        <div className={`inline-block px-3 py-1 mt-2 text-xs font-bold uppercase rounded ${
          props.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          Status: {props.status}
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4">1. The Parties</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase">The Performer</h3>
            <p className="font-bold text-lg">{props.performerName}</p>
            {props.performerEntity && <p className="text-sm italic">{props.performerEntity}</p>}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase">The Talent Seeker</h3>
            <p className="font-bold text-lg">{props.seekerName}</p>
            {props.seekerEntity && <p className="text-sm italic">{props.seekerEntity}</p>}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4">2. Event & Performance Details</h2>
        <div className="space-y-2">
          <p><strong>Venue:</strong> {props.venueName} - {props.venueAddress}</p>
          <p><strong>Date:</strong> {props.eventDate}</p>
          <div className="flex gap-8">
            <p><strong>Call Time:</strong> {props.callTime}</p>
            <p><strong>Performance Window:</strong> {props.startTime} - {props.endTime}</p>
          </div>
          <p><strong>Acts to be Performed:</strong> {props.acts.join(', ')}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4">3. Financial Terms</h2>
        <p className="text-lg"><strong>Total Performance Fee:</strong> <span className="text-2xl font-bold">{props.currency} {props.totalFee.toLocaleString()}</span></p>
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 text-sm">
          <p className="font-bold mb-2 uppercase text-xs text-gray-500">Kill Fee Schedule:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Notice &gt; 14 days: 0% Fee (Full Refund minus Platform Fees)</li>
            <li>Notice 7-14 days: 50% Fee Payable to Performer</li>
            <li>Notice &lt; 7 days: 100% Fee Payable to Performer</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4">4. Technical Requirements</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Stage:</strong> {props.technicalRider.stage}</div>
          <div><strong>Audio:</strong> {props.technicalRider.audio}</div>
          <div><strong>Lighting:</strong> {props.technicalRider.lighting}</div>
          <div><strong>Hospitality:</strong> {props.technicalRider.hospitality}</div>
        </div>
        {props.cues.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Performance Cues:</h3>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-300">Timestamp</th>
                  <th className="p-2 border border-gray-300">Action/Cue</th>
                </tr>
              </thead>
              <tbody>
                {props.cues.map((cue, i) => (
                  <tr key={i}>
                    <td className="p-2 border border-gray-300 font-mono">{cue.timestamp}</td>
                    <td className="p-2 border border-gray-300">{cue.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-8 text-sm space-y-4 text-gray-700">
        <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 text-gray-900">5. Standard Policies</h2>
        <p><strong>5.1 Safety-Exit Guarantee:</strong> The Performer maintains the right to terminate the performance immediately and exit the venue if they encounter a verified safety threat, as defined in the Platform Terms of Service. In such cases, the Performer remains entitled to 100% of the Booking Fee.</p>
        <p><strong>5.2 Escrow & Release:</strong> Funds are held by the Platform and released to the Performer 48 hours after the Event End Time, provided no dispute is raised via the Resolution Center.</p>
      </section>

      <div className="mt-12 pt-8 border-t-2 border-gray-900">
        {props.status === 'active' ? (
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs uppercase font-bold text-gray-500">Digitally Signed & Secured</p>
              <p className="text-sm font-bold">Accepted At: {props.acceptedAt}</p>
            </div>
            <div className="text-right">
              <div className="w-48 h-12 border-b border-gray-900 flex items-center justify-center italic font-serif text-xl">
                {props.performerName}
              </div>
              <p className="text-xs uppercase mt-1">Performer Signature</p>
            </div>
          </div>
        ) : (
          <p className="text-center italic text-gray-500">Document Pending Final Acceptance</p>
        )}
      </div>
    </div>
  );
};
