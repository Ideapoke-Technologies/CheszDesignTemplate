// ===== CRITICAL: Patch DOM methods BEFORE any imports =====
// This MUST be at the very top to catch translation errors

// Save original methods
const originalRemoveChild = Node.prototype.removeChild;
const originalInsertBefore = Node.prototype.insertBefore;
const originalReplaceChild = Node.prototype.replaceChild;

// Patch removeChild - ULTRA DEFENSIVE
Node.prototype.removeChild = function <T extends Node>(child: T): T {
  // If child doesn't exist, just return it
  if (!child) return child;

  try {
    // First check: is this child actually ours?
    if (child.parentNode === this) {
      // Safe to remove
      return originalRemoveChild.call(this, child);
    }

    // Second check: does child have a different parent? (translation moved it)
    if (child.parentNode && child.parentNode !== this) {
      // Try to remove from actual parent
      try {
        return child.parentNode.removeChild(child) as T;
      } catch (e) {
        // Even that failed - just return the child
        return child;
      }
    }

    // Third case: child has no parent (already removed or never attached)
    // Just return it as if removed
    return child;
  } catch (error: any) {
    // Catch ANY error during removal - don't let it propagate
    // This handles browser translation edge cases
    return child;
  }
};

// Patch insertBefore - ULTRA DEFENSIVE
Node.prototype.insertBefore = function <T extends Node>(
  newNode: T,
  referenceNode: Node | null,
): T {
  if (!newNode) return newNode;

  try {
    // Remove from current parent if attached elsewhere
    if (newNode.parentNode && newNode.parentNode !== this) {
      try {
        newNode.parentNode.removeChild(newNode);
      } catch (e) {
        // Ignore removal errors
      }
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  } catch (error: any) {
    // ANY error - just return the new node
    return newNode;
  }
};

// Patch replaceChild - ULTRA DEFENSIVE
Node.prototype.replaceChild = function <T extends Node>(
  newChild: Node,
  oldChild: T,
): T {
  if (!oldChild) return oldChild;

  try {
    return originalReplaceChild.call(this, newChild, oldChild);
  } catch (error: any) {
    // ANY error - return old child as if replaced
    return oldChild;
  }
};

// Verify patches are applied (will show in console on app start)
if (typeof window !== "undefined") {
  console.log("✅ Browser translation error protection enabled");
  console.log("DOM methods patched:", {
    removeChild: Node.prototype.removeChild !== originalRemoveChild,
    insertBefore: Node.prototype.insertBefore !== originalInsertBefore,
    replaceChild: Node.prototype.replaceChild !== originalReplaceChild,
  });
}

// Patch console.error to suppress React's translation error logging
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Check if any argument contains translation-related error messages
  const hasTranslationError = args.some((arg) => {
    const str = String(arg);
    return (
      (str.includes("removeChild") ||
        str.includes("is not a child") ||
        str.includes("NotFoundError") ||
        str.includes("insertBefore") ||
        str.includes("replaceChild")) &&
      (str.includes("Node") ||
        str.includes("commitDeletion") ||
        str.includes("removeChildFromContainer") ||
        str.includes("DOMException"))
    );
  });

  if (!hasTranslationError) {
    originalConsoleError.apply(console, args);
  }
};

// NOW import React and other modules
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handler - with capture phase to catch BEFORE React
window.addEventListener(
  "error",
  (event) => {
    const errorMessage = event.error?.message || event.message || "";
    const errorStack = event.error?.stack || "";
    const errorName = event.error?.name || "";

    // Check for browser translation errors
    const isTranslationError =
      errorName === "DOMException" ||
      errorMessage.includes("removeChild") ||
      errorMessage.includes("NotFoundError") ||
      errorMessage.includes("is not a child") ||
      errorMessage.includes("insertBefore") ||
      errorMessage.includes("replaceChild") ||
      errorStack.includes("commitDeletionEffects") ||
      errorStack.includes("removeChildFromContainer") ||
      errorStack.includes("commitDeletionEffectsOnFiber");

    if (isTranslationError) {
      // Log for debugging (will be suppressed by console.error patch)
      console.warn(
        "🛡️ Translation error blocked:",
        errorMessage.substring(0, 100),
      );

      // Completely prevent the error from propagating
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  },
  true,
); // Use capture phase to intercept BEFORE React!

// Catch unhandled promise rejections related to DOM operations
window.addEventListener("unhandledrejection", (event) => {
  const errorMessage = event.reason?.message || "";

  if (
    errorMessage.includes("removeChild") ||
    errorMessage.includes("NotFoundError")
  ) {
    console.warn(
      "Browser translation DOM error in promise caught and suppressed:",
      errorMessage,
    );
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
