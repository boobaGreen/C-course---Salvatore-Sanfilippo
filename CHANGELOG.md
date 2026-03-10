# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-11

### Added
- **New Interactive Games**:
  - `StackAttack` (Lesson 07): A game to visualize recursion and stack depth.
  - `EndianSwapper` (Lesson 11): Drag-and-drop bytes to master Big/Little-endian conversion.
  - `FunctionPointerDispatcher` (Lesson 22): Interactive visualization of jump tables and O(1) dispatch.
- **New Educational Tools**:
  - `StructLayoutVisualizer` (Lesson 14): Byte-by-byte visualization of padding and alignment.
  - `EvalTracer` (Lessons 23-24): Step-through stack visualization for the ToyFort interpreter.
  - `MakefileFlowchart` (Lesson 29): Visual dependency tracking for the `make` build process.
- **Appendix Revamps**:
  - **Lesson 02 Appendix**: Added advanced "Pro Challenge" for deep architectural insights.
  - **Lesson 31 Appendix**: Complete overhaul with 5+ quiz questions and realistic Terminal Challenges.

### Fixed
- Multiple React purity lints in interactive components.
- State update cascading issues in `useEffect` hooks.
- Missing dependencies in `useCallback` and `useEffect`.
- Unused imports and unused state variables.

## [1.0.3] - 2026-03-11

- **Educational Content Completion**: Fully implemented Lesson 02 and 31 Appendices.
- **Advanced Assessment**:
  - Expanded Lesson 31 questions (5+ standard) to meet the quality baseline.
  - Introduced **Pro Challenges** for Appendices 02 and 31.
  - Revamped **Pro Terminal Challenges** with realistic shell commands.

## [1.0.2] - 2026-03-10

- **Curriculum Expansion**: Established Lesson 2 as two distinct entries: **Base** and **Appendix**.
- **Lesson 2 Restoration**: Restored original C programming depth in Lesson 2.
- **Visual Improvements**: Added color legends to Micro-Emulator 6502 and refactored Stack Visualizer.

## [1.0.1] - 2026-03-10

- **Persistence**: Added automatic progress saving.
- **Video Resume**: integrated YouTube IFrame API for video state persistence.

## [1.0.0] - 2026-03-10

- Initial bilingual release (IT/EN).
- WASM Compiler integration.
- Interactive memory visualizers.
