import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [courseTypes, setCourseTypes] = useState([
    { id: 1, name: 'Individual' },
    { id: 2, name: 'Group' },
    { id: 3, name: 'Special' }
  ]);

  const [courses, setCourses] = useState([
    { id: 1, name: 'Hindi' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Urdu' }
  ]);

  const [courseOfferings, setCourseOfferings] = useState([
    { id: 1, courseId: 1, courseTypeId: 1 }, // Individual - Hindi
    { id: 2, courseId: 2, courseTypeId: 1 }, // Individual - English
    { id: 3, courseId: 1, courseTypeId: 2 }, // Group - Hindi
  ]);

  const [registrations, setRegistrations] = useState([
    { id: 1, studentName: 'John Doe', studentEmail: 'john@example.com', offeringId: 1 },
    { id: 2, studentName: 'Jane Smith', studentEmail: 'jane@example.com', offeringId: 2 },
  ]);

  // Course Types CRUD
  const addCourseType = (name) => {
    const newId = Math.max(0, ...courseTypes.map(ct => ct.id)) + 1;
    setCourseTypes([...courseTypes, { id: newId, name }]);
  };

  const updateCourseType = (id, name) => {
    setCourseTypes(courseTypes.map(ct => ct.id === id ? { ...ct, name } : ct));
  };

  const deleteCourseType = (id) => {
    // Also delete course offerings that use this course type
    setCourseOfferings(courseOfferings.filter(co => co.courseTypeId !== id));
    // Also delete registrations for those offerings
    const offeringIdsToDelete = courseOfferings
      .filter(co => co.courseTypeId === id)
      .map(co => co.id);
    setRegistrations(registrations.filter(r => !offeringIdsToDelete.includes(r.offeringId)));
    setCourseTypes(courseTypes.filter(ct => ct.id !== id));
  };

  // Courses CRUD
  const addCourse = (name) => {
    const newId = Math.max(0, ...courses.map(c => c.id)) + 1;
    setCourses([...courses, { id: newId, name }]);
  };

  const updateCourse = (id, name) => {
    setCourses(courses.map(c => c.id === id ? { ...c, name } : c));
  };

  const deleteCourse = (id) => {
    // Also delete course offerings that use this course
    setCourseOfferings(courseOfferings.filter(co => co.courseId !== id));
    // Also delete registrations for those offerings
    const offeringIdsToDelete = courseOfferings
      .filter(co => co.courseId === id)
      .map(co => co.id);
    setRegistrations(registrations.filter(r => !offeringIdsToDelete.includes(r.offeringId)));
    setCourses(courses.filter(c => c.id !== id));
  };

  // Course Offerings CRUD
  const addCourseOffering = (courseId, courseTypeId) => {
    const newId = Math.max(0, ...courseOfferings.map(co => co.id)) + 1;
    setCourseOfferings([...courseOfferings, { id: newId, courseId: parseInt(courseId), courseTypeId: parseInt(courseTypeId) }]);
  };

  const updateCourseOffering = (id, courseId, courseTypeId) => {
    setCourseOfferings(courseOfferings.map(co => 
      co.id === id 
        ? { ...co, courseId: parseInt(courseId), courseTypeId: parseInt(courseTypeId) }
        : co
    ));
  };

  const deleteCourseOffering = (id) => {
    // Also delete registrations for this offering
    setRegistrations(registrations.filter(r => r.offeringId !== id));
    setCourseOfferings(courseOfferings.filter(co => co.id !== id));
  };

  // Student Registrations
  const addRegistration = (studentName, studentEmail, offeringId) => {
    const newId = Math.max(0, ...registrations.map(r => r.id)) + 1;
    setRegistrations([...registrations, { 
      id: newId, 
      studentName, 
      studentEmail, 
      offeringId: parseInt(offeringId) 
    }]);
  };

  const deleteRegistration = (id) => {
    setRegistrations(registrations.filter(r => r.id !== id));
  };

  const getOfferingDisplayName = (offering) => {
    const course = courses.find(c => c.id === offering.courseId);
    const courseType = courseTypes.find(ct => ct.id === offering.courseTypeId);
    return `${courseType?.name || 'Unknown'} - ${course?.name || 'Unknown'}`;
  };

  const getRegistrationsForOffering = (offeringId) => {
    return registrations.filter(r => r.offeringId === offeringId);
  };

  return (
    <AppContext.Provider
      value={{
        courseTypes,
        courses,
        courseOfferings,
        registrations,
        addCourseType,
        updateCourseType,
        deleteCourseType,
        addCourse,
        updateCourse,
        deleteCourse,
        addCourseOffering,
        updateCourseOffering,
        deleteCourseOffering,
        addRegistration,
        deleteRegistration,
        getOfferingDisplayName,
        getRegistrationsForOffering,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

