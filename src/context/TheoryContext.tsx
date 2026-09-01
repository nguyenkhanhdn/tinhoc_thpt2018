import React, { createContext, useContext, useState, useEffect } from 'react';
import { TheoryLesson, SubjectTopic } from '../types';
import { SUBJECT_TOPICS, INITIAL_LESSONS } from '../data/topicsAndLessons';
import { dbApi } from '../lib/api';

interface TheoryContextType {
  topics: SubjectTopic[];
  lessons: TheoryLesson[];
  selectedLesson: TheoryLesson | null;
  setSelectedLesson: (lesson: TheoryLesson | null) => void;
  getLessonById: (lessonId: string) => TheoryLesson | undefined;
  getLessonsByTopic: (topicId: string) => TheoryLesson[];
  addLesson: (lesson: Omit<TheoryLesson, 'id' | 'updatedAt'>) => Promise<void>;
  updateLesson: (id: string, lessonData: Partial<TheoryLesson>) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  quickTheoryModalId: string | null;
  setQuickTheoryModalId: (lessonId: string | null) => void;
}

const TheoryContext = createContext<TheoryContextType | undefined>(undefined);

export const TheoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<SubjectTopic[]>(SUBJECT_TOPICS);
  const [lessons, setLessons] = useState<TheoryLesson[]>(() => {
    try {
      const saved = localStorage.getItem('tin_hoc_lessons');
      return saved ? JSON.parse(saved) : INITIAL_LESSONS;
    } catch {
      return INITIAL_LESSONS;
    }
  });

  const [selectedLesson, setSelectedLesson] = useState<TheoryLesson | null>(null);
  const [quickTheoryModalId, setQuickTheoryModalId] = useState<string | null>(null);

  // Sync with SQLite on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([dbApi.getTopics(), dbApi.getLessons()]).then(([remoteTopics, remoteLessons]) => {
      if (isMounted) {
        if (remoteTopics && remoteTopics.length > 0) {
          setTopics(remoteTopics);
        }
        if (remoteLessons && remoteLessons.length > 0) {
          setLessons(remoteLessons);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('tin_hoc_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const getLessonById = (lessonId: string) => {
    return lessons.find(l => l.id === lessonId);
  };

  const getLessonsByTopic = (topicId: string) => {
    return lessons.filter(l => l.topicId === topicId).sort((a, b) => a.order - b.order);
  };

  const addLesson = async (lessonData: Omit<TheoryLesson, 'id' | 'updatedAt'>) => {
    const newLesson: TheoryLesson = {
      ...lessonData,
      id: `lesson_${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLessons(prev => [...prev, newLesson]);

    // Persist to SQLite
    const created = await dbApi.createLesson(newLesson);
    if (created) {
      setLessons(prev => prev.map(l => l.id === newLesson.id ? created : l));
    }
  };

  const updateLesson = async (id: string, lessonData: Partial<TheoryLesson>) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...lessonData, updatedAt: new Date().toISOString().split('T')[0] } : l));
    // Persist to SQLite
    await dbApi.updateLesson(id, lessonData);
  };

  const deleteLesson = async (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id));
    // Delete from SQLite
    await dbApi.deleteLesson(id);
  };

  return (
    <TheoryContext.Provider value={{
      topics,
      lessons,
      selectedLesson,
      setSelectedLesson,
      getLessonById,
      getLessonsByTopic,
      addLesson,
      updateLesson,
      deleteLesson,
      quickTheoryModalId,
      setQuickTheoryModalId
    }}>
      {children}
    </TheoryContext.Provider>
  );
};

export const useTheory = () => {
  const context = useContext(TheoryContext);
  if (!context) throw new Error('useTheory must be used within a TheoryProvider');
  return context;
};
