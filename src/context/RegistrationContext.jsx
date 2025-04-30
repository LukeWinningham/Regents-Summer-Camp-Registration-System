import React, { createContext, useContext, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const RegistrationContext = createContext();

export const useRegistrations = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState([]);
  const MAX_CAPACITY = 1; // Set program capacity to 1 for testing

  useEffect(() => {
    // Load registrations from localStorage on mount
    const savedRegistrations = localStorage.getItem('registrations');
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  }, []);

  useEffect(() => {
    // Save registrations to localStorage whenever they change
    localStorage.setItem('registrations', JSON.stringify(registrations));
  }, [registrations]);

  const addRegistration = (registration) => {
    setRegistrations(prev => [...prev, registration]);
  };

  const checkEmailExists = (email) => {
    return registrations.some(reg => reg.email === email);
  };

  const checkProgramAvailability = (program) => {
    const enrolledCount = registrations.filter(
      reg => reg.program === program && reg.status === 'enrolled'
    ).length;
    return enrolledCount >= MAX_CAPACITY;
  };

  const getWaitlistPosition = () => {
    const waitlistedCount = registrations.filter(
      reg => reg.status === 'waitlisted'
    ).length;
    return waitlistedCount + 1;
  };

  const getRegistrations = () => {
    return registrations;
  };

  const sendAcceptanceEmail = async (student) => {
    try {
      const templateParams = {
        to_name: student.parentName,
        to_email: student.email,
        student_name: student.studentName,
        program: student.program,
        grade: student.grade,
      };

      await emailjs.send(
        'service_lgg3a0i',
        'template_pu1j2sm', 
        templateParams
      );

      return true;
    } catch (error) {
      console.error('Failed to send acceptance email:', error);
      return false;
    }
  };

  const removeRegistration = async (email) => {
    setRegistrations(prev => prev.filter(reg => reg.email !== email));

    // Get all waitlisted students sorted by registration date
    const waitlistedStudents = registrations
      .filter(reg => reg.status === 'waitlisted')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (waitlistedStudents.length > 0) {
      const nextStudent = waitlistedStudents[0];
      
      // Send acceptance email
      const emailSent = await sendAcceptanceEmail(nextStudent);
      
      if (emailSent) {
        // Update the student's status to enrolled
        setRegistrations(prev => prev.map(reg => 
          reg.email === nextStudent.email 
            ? { ...reg, status: 'enrolled' }
            : reg
        ));
      }
    }
  };

  const value = {
    registrations,
    addRegistration,
    checkEmailExists,
    checkProgramAvailability,
    getWaitlistPosition,
    getRegistrations,
    removeRegistration,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}; 