import { useAppDispatch, useAppSelector } from "../../../hooks/useRedux";
import { toggleGoal } from "../../../store/slices/onboardingSlice";
import GoalPill from "../GoalPill";
import PrimaryButton from "../../ui/PrimaryButton";

interface Props {
  onNext: () => void;
}

// ─── Goal options ─────────────────────────────────────────────────────────────

const ALL_GOALS = [
  "Understand superposition",
  "Build my first circuit",
  "Prep for a quantum course",
  "Explore Grover's algorithm",
  "Debug entanglement errors",
  "Master phase kickback",
  "Run on real cloud hardware",
] as const;

// Maps a selected goal → curriculum module title
const CURRICULUM_MAP: Record<string, string> = {
  "Understand superposition":     "Superposition & single-qubit states",
  "Build my first circuit":       "Circuit composition & Bell states",
  "Explore Grover's algorithm":   "Grover's search & phase inversion",
  "Prep for a quantum course":    "Quantum measurement & foundations",
  "Debug entanglement errors":    "Entanglement & Bell inequalities",
  "Master phase kickback":        "Phase kickback & quantum Fourier transform",
  "Run on real cloud hardware":   "IBM Quantum cloud execution",
};

// ─── Slide ────────────────────────────────────────────────────────────────────

export default function Step4_Goals({ onNext }: Props) {
  const dispatch = useAppDispatch();
  const goals = useAppSelector((s) => s.onboarding.goals);

  // First 3 selected goals mapped to curriculum items
  const curriculumItems = goals.slice(0, 3).map((g) => CURRICULUM_MAP[g]).filter(Boolean);

  return (
    <div className="flex flex-col gap-5">
      {/* Badge + heading */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 3H13M3 7H11M5 11H9" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-[11px] font-semibold text-[#94A3B8] tracking-[1px] uppercase">
            Curriculum Synthesis
          </span>
        </div>
        <h1 className="text-[26px] font-bold text-[#0B1C30] leading-[34px] mb-2">
          What do you want to be able to do?
        </h1>
        <p className="text-[14px] text-[#64748B] leading-[22px]">
          Select all that apply. We'll order your curriculum modules accordingly.
        </p>
      </div>

      {/* Goal pills — flex-wrap to match design */}
      <div className="flex flex-wrap gap-2">
        {ALL_GOALS.map((goal) => (
          <GoalPill
            key={goal}
            label={goal}
            selected={goals.includes(goal)}
            onClick={() => dispatch(toggleGoal(goal))}
          />
        ))}
      </div>

      {/* Curriculum preview */}
      <div className="rounded-2xl border border-[#E2E8F0] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            <span className="text-[10px] font-semibold text-[#64748B] tracking-[1.2px] uppercase">
              Curriculum Preview
            </span>
          </div>
          {goals.length > 0 && (
            <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              Calibrated
            </span>
          )}
        </div>

        {curriculumItems.length > 0 ? (
          <div className="flex flex-col gap-1.5 mb-3">
            {curriculumItems.map((item, i) => (
              <div key={item} className="flex items-baseline gap-3">
                <span className="text-[10px] font-bold text-[#818CF8] shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] text-[#6366F1]">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[#94A3B8] mb-3">
            Select goals above to see your curriculum.
          </p>
        )}

        <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-2.5">
          <span className="text-[11px] text-[#94A3B8]">Dynamic sequencing calibrated</span>
          {goals.length > 0 && (
            <span className="text-[11px] font-semibold text-[#64748B]">
              {Math.min(goals.length, 3)} core module{Math.min(goals.length, 3) !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <PrimaryButton fullWidth disabled={goals.length === 0} onClick={onNext}>
        Review &amp; finalize →
      </PrimaryButton>

      {/* Hint */}
      <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#94A3B8]">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M6.5 4V6.5L8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        Dynamic sequencing adapts as you simulate
      </div>
    </div>
  );
}
