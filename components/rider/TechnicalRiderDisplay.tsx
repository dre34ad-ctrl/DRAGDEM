interface TechnicalRiderProps {
  stage: {
    minWidth: number;
    minDepth: number;
    surface: string;
  };
  audio: {
    micType: string;
    monitoring: string;
  };
  hospitality: string[];
}

export const TechnicalRiderDisplay = ({ stage, audio, hospitality }: TechnicalRiderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-pink-200 dark:border-pink-900">
      <h3 className="text-2xl font-bold text-pink-600 mb-4">Technical Rider</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h4 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Stage</h4>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300">
            <li><strong>Minimum Dimensions:</strong> {stage.minWidth}m x {stage.minDepth}m</li>
            <li><strong>Surface:</strong> {stage.surface}</li>
          </ul>
        </section>

        <section>
          <h4 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Audio</h4>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300">
            <li><strong>Microphone:</strong> {audio.micType}</li>
            <li><strong>Monitoring:</strong> {audio.monitoring}</li>
          </ul>
        </section>
      </div>

      <section className="mt-6">
        <h4 className="font-semibold text-lg border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">Hospitality</h4>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {hospitality.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};
