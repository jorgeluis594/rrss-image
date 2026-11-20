import React from 'react';
import { CalculateMetadataFunction, Composition } from 'remotion';
import type { Timeline } from './types';
import { Video } from './Video';

const empty: Timeline = { clips: [] };

const calculateMetadata: CalculateMetadataFunction<Timeline> = ({ props }) => {
  const fps = props.fps ?? 30;
  const end = Math.max(0, ...props.clips.map((c) => c.start + c.duration));
  const seconds = props.duration ?? end;
  return {
    fps,
    width: props.width ?? 1080,
    height: props.height ?? 1920,
    durationInFrames: Math.max(1, Math.round(seconds * fps)),
  };
};

export const Root: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    defaultProps={empty}
    calculateMetadata={calculateMetadata}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={1}
  />
);
