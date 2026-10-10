// The dark garage "studio" behind a car: spotlight cone from above, cool rim
// light on the horizon, slow haze, and a glossy floor. Purely decorative and
// CSS-only (classes in app/globals.css), so it costs no JavaScript.
type Props = {
  /** Where the floor starts, as % from the top */
  horizon?: number;
  /** Set false when the floor is placed separately, lined up with the car's tyres */
  floor?: boolean;
  /** Blink the lamp on when the page loads (home hero only) */
  lampOn?: boolean;
  /** Extra classes for the cone, e.g. hover brightening on cards */
  coneClassName?: string;
  className?: string;
};

export default function StudioBackdrop({
  horizon = 68,
  floor = true,
  lampOn = false,
  coneClassName = "",
  className = "",
}: Props) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {floor && <div className="studio-floor absolute inset-x-0 bottom-0" style={{ top: `${horizon}%` }} />}
      <div className="studio-rim absolute inset-0" />
      <div className="studio-haze absolute inset-[-10%]" />
      <div className={`studio-cone absolute inset-0 ${lampOn ? "animate-lamp" : ""} ${coneClassName}`} />
    </div>
  );
}
