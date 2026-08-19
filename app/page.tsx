"use client";

import { useState } from "react";
import { useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

export default function Home() {
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const arenaRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const lastDodgeRef = useRef(0);

  const dodgeNoButton = (
    event: PointerEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>,
    forceEscape = false,
  ) => {
    const arena = arenaRef.current;
    const noButton = noButtonRef.current;
    const now = performance.now();

    if (
      !arena ||
      !noButton ||
      (!forceEscape && now - lastDodgeRef.current < 220)
    ) {
      return;
    }

    const arenaRect = arena.getBoundingClientRect();
    const yesButton = yesButtonRef.current;
    const buttonRect = noButton.getBoundingClientRect();
    const pointerX = event.clientX;
    const pointerY = event.clientY;
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    const distanceToPointer = Math.hypot(
      buttonCenterX - pointerX,
      buttonCenterY - pointerY,
    );
    const safetyRadius = 74;

    if (distanceToPointer > safetyRadius) {
      return;
    }

    const awayX = buttonCenterX - pointerX;
    const awayY = buttonCenterY - pointerY;
    const awayLength = Math.hypot(awayX, awayY);
    const fallbackAngle = Math.random() * Math.PI * 2;
    const directionX = awayLength ? awayX / awayLength : Math.cos(fallbackAngle);
    const directionY = awayLength ? awayY / awayLength : Math.sin(fallbackAngle);
    const escapeDistance = forceEscape ? 160 : 128;
    const angles = [0, 45, -45, 90, -90, 135, -135, 180];
    const padding = 8;
    const baseLeft = buttonRect.left - noOffset.x;
    const baseTop = buttonRect.top - noOffset.y;
    const candidates = angles.map((angle) => {
      const radians = (angle * Math.PI) / 180;
      const candidateX =
        directionX * Math.cos(radians) - directionY * Math.sin(radians);
      const candidateY =
        directionX * Math.sin(radians) + directionY * Math.cos(radians);
      const targetCenterX = buttonCenterX + candidateX * escapeDistance;
      const targetCenterY = buttonCenterY + candidateY * escapeDistance;
      const targetLeft = clamp(
        targetCenterX - buttonRect.width / 2,
        arenaRect.left + padding,
        arenaRect.right - buttonRect.width - padding,
      );
      const targetTop = clamp(
        targetCenterY - buttonRect.height / 2,
        arenaRect.top + padding,
        arenaRect.bottom - buttonRect.height - padding,
      );

      const candidateRight = targetLeft + buttonRect.width;
      const candidateBottom = targetTop + buttonRect.height;
      const avoidsYes =
        !yesButton ||
        candidateRight < yesButton.getBoundingClientRect().left - 12 ||
        targetLeft > yesButton.getBoundingClientRect().right + 12 ||
        candidateBottom < yesButton.getBoundingClientRect().top - 12 ||
        targetTop > yesButton.getBoundingClientRect().bottom + 12;

      return {
        avoidsYes,
        x: targetLeft - baseLeft,
        y: targetTop - baseTop,
        distance: Math.hypot(
          targetLeft + buttonRect.width / 2 - pointerX,
          targetTop + buttonRect.height / 2 - pointerY,
        ),
      };
    });
    const safeCandidates = candidates.filter((candidate) => candidate.avoidsYes);
    const target = (safeCandidates.length > 0 ? safeCandidates : candidates).reduce(
      (best, candidate) =>
      candidate.distance > best.distance ? candidate : best,
    );

    lastDodgeRef.current = now;

    setNoOffset({
      x: target.x,
      y: target.y,
    });
  };

  return (
    <main className="offer-page">
      <div className="offer-panel">
        <p className="offer-kicker">A small question</p>
        <h1>Do you want to go on a date with me?</h1>
        <div
          aria-label="Offer response"
          className="button-arena"
          onPointerMove={dodgeNoButton}
          ref={arenaRef}
        >
          <button
            className="offer-button yes-button"
            ref={yesButtonRef}
            type="button"
          >
            Yes
          </button>
          <button
            className="offer-button no-button"
            onClick={(event) => dodgeNoButton(event, true)}
            ref={noButtonRef}
            style={{ transform: `translate(${noOffset.x}px, ${noOffset.y}px)` }}
            type="button"
          >
            No
          </button>
        </div>
      </div>
    </main>
  );
}
