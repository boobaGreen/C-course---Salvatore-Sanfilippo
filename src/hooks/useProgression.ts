import { useProgression as useProgressionContext } from '../contexts/ProgressionContext';

export function useProgression() {
    return useProgressionContext();
}
