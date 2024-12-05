'use client';
import { ScaleLoader } from "react-spinners";

export default function Preloader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <ScaleLoader
        color="#aaa"
        loading={true}
        speedMultiplier={4}
      />
    </div>
  );
}
