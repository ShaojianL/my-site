import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activities Selection",
  description: "Pick what we should do together.",
};

export default function ActivitiesSelectionPage() {
  return (
    <main className="offer-page">
      <div className="offer-panel">
        <p className="offer-kicker">Next step</p>
        <h1>Activities Selection, in-progress</h1>
      </div>
    </main>
  );
}
