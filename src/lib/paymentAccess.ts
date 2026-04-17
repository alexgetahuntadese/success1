// Check if a chapter is free (doesn't require premium)
export const isFreeChapter = (chapterIndex: number): boolean => {
  // For now, all chapters in grades are free since grades don't require login
  return true;
};

// Check if a matric subject is free
export const isFreeMatricSubject = (subjectIndex: number): boolean => {
  // Matric subjects require premium access
  return false;
};