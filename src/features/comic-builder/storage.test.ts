import { describe, expect, it, beforeEach } from "vitest";
import { createProject, loadBuilderState, saveBuilderState, storeFalKey, getFalKey, clearFalKey, hasFalKey } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("createProject", () => {
    it("creates a project with correct schema and defaults", () => {
      const project = createProject("My Comic");
      expect(project.title).toBe("My Comic");
      expect(project.schemaVersion).toBe("comic-builder.v1");
      expect(project.pages).toEqual([]);
      expect(project.characters).toEqual([]);
      expect(project.style.artStyle).toBe("cyberpunk-neon");
      expect(project.id).toBeTruthy();
    });
  });

  describe("loadBuilderState / saveBuilderState", () => {
    it("returns empty state when nothing stored", () => {
      const state = loadBuilderState();
      expect(state.projects).toEqual([]);
      expect(state.activeProjectId).toBeNull();
    });

    it("round-trips saved state", () => {
      const state = { projects: [createProject("Test")], activeProjectId: "x", falKeyStored: false };
      saveBuilderState(state);
      const loaded = loadBuilderState();
      expect(loaded.projects.length).toBe(1);
      expect(loaded.projects[0].title).toBe("Test");
    });
  });

  describe("fal key", () => {
    it("stores and retrieves key from sessionStorage", () => {
      expect(hasFalKey()).toBe(false);
      storeFalKey("fal-test-123");
      expect(hasFalKey()).toBe(true);
      expect(getFalKey()).toBe("fal-test-123");
    });

    it("clears key", () => {
      storeFalKey("fal-test-123");
      clearFalKey();
      expect(hasFalKey()).toBe(false);
      expect(getFalKey()).toBeNull();
    });
  });
});
