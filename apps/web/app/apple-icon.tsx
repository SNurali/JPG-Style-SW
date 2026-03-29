import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
          borderRadius: 40,
          position: 'relative',
        }}
      >
        {/* Subtle accent overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 40,
            background: 'linear-gradient(135deg, rgba(67,97,238,0.2) 0%, rgba(58,86,212,0.05) 100%)',
          }}
        />
        {/* Border */}
        <div
          style={{
            position: 'absolute',
            inset: 2,
            borderRadius: 38,
            border: '2px solid rgba(67,97,238,0.3)',
          }}
        />
        {/* SW text */}
        <span
          style={{
            fontSize: 90,
            fontWeight: 800,
            fontFamily: 'Inter, Helvetica, Arial, sans-serif',
            letterSpacing: -4,
            background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 40%, #c8c8c8 60%, #e0e0e0 80%, #b0b0b0 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          SW
        </span>
      </div>
    ),
    { ...size }
  );
}
