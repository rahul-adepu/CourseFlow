import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './StudentRegistrations.css';

const StudentRegistrations = () => {
  const { 
    courseOfferings, 
    courseTypes, 
    registrations,
    addRegistration, 
    deleteRegistration,
    getOfferingDisplayName,
    getRegistrationsForOffering 
  } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedOfferingId, setSelectedOfferingId] = useState('');
  const [filterCourseTypeId, setFilterCourseTypeId] = useState('');
  const [formData, setFormData] = useState({ studentName: '', studentEmail: '', offeringId: '' });
  const [errors, setErrors] = useState({});

  const validate = (name, email, offeringId) => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    if (!email.trim()) {
      newErrors.studentEmail = 'Student email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.studentEmail = 'Please enter a valid email address';
    }
    if (!offeringId) {
      newErrors.offeringId = 'Please select a course offering';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData.studentName, formData.studentEmail, formData.offeringId);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    addRegistration(formData.studentName.trim(), formData.studentEmail.trim(), formData.offeringId);
    setFormData({ studentName: '', studentEmail: '', offeringId: '' });
    setIsAdding(false);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({ studentName: '', studentEmail: '', offeringId: '' });
    setIsAdding(false);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      deleteRegistration(id);
    }
  };

  // Filter course offerings based on selected course type
  const filteredOfferings = filterCourseTypeId
    ? courseOfferings.filter(co => co.courseTypeId === parseInt(filterCourseTypeId))
    : courseOfferings;

  // Get available offerings for registration (not filtered by selected offering for viewing)
  const availableOfferingsForRegistration = courseOfferings;

  return (
    <div className="student-registrations">
      <div className="section-header">
        <h2>Student Registrations</h2>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + Register Student
          </button>
        )}
      </div>

      {isAdding && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Register New Student</h3>
          <div className="form-group">
            <label htmlFor="studentName">Student Name *</label>
            <input
              type="text"
              id="studentName"
              value={formData.studentName}
              onChange={(e) => {
                setFormData({ ...formData, studentName: e.target.value });
                if (errors.studentName) setErrors({ ...errors, studentName: '' });
              }}
              placeholder="Enter student name"
              className={errors.studentName ? 'error' : ''}
            />
            {errors.studentName && <span className="error-message">{errors.studentName}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="studentEmail">Student Email *</label>
            <input
              type="email"
              id="studentEmail"
              value={formData.studentEmail}
              onChange={(e) => {
                setFormData({ ...formData, studentEmail: e.target.value });
                if (errors.studentEmail) setErrors({ ...errors, studentEmail: '' });
              }}
              placeholder="Enter student email"
              className={errors.studentEmail ? 'error' : ''}
            />
            {errors.studentEmail && <span className="error-message">{errors.studentEmail}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="offeringId">Course Offering *</label>
            <select
              id="offeringId"
              value={formData.offeringId}
              onChange={(e) => {
                setFormData({ ...formData, offeringId: e.target.value });
                if (errors.offeringId) setErrors({ ...errors, offeringId: '' });
              }}
              className={errors.offeringId ? 'error' : ''}
            >
              <option value="">Select a course offering</option>
              {availableOfferingsForRegistration.map((offering) => (
                <option key={offering.id} value={offering.id}>
                  {getOfferingDisplayName(offering)}
                </option>
              ))}
            </select>
            {errors.offeringId && <span className="error-message">{errors.offeringId}</span>}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="filterCourseType">Filter by Course Type:</label>
          <select
            id="filterCourseType"
            value={filterCourseTypeId}
            onChange={(e) => setFilterCourseTypeId(e.target.value)}
          >
            <option value="">All Course Types</option>
            {courseTypes.map((ct) => (
              <option key={ct.id} value={ct.id}>
                {ct.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="viewOffering">View Registrations for Offering:</label>
          <select
            id="viewOffering"
            value={selectedOfferingId}
            onChange={(e) => setSelectedOfferingId(e.target.value)}
          >
            <option value="">All Offerings</option>
            {filteredOfferings.map((offering) => (
              <option key={offering.id} value={offering.id}>
                {getOfferingDisplayName(offering)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="registrations-container">
        {selectedOfferingId ? (
          // Show registrations for selected offering
          (() => {
            const offeringRegistrations = getRegistrationsForOffering(parseInt(selectedOfferingId));
            const offering = courseOfferings.find(o => o.id === parseInt(selectedOfferingId));
            return (
              <div className="offering-registrations">
                <h3>Registrations for {offering ? getOfferingDisplayName(offering) : 'Selected Offering'}</h3>
                {offeringRegistrations.length === 0 ? (
                  <p className="empty-state">No students registered for this offering.</p>
                ) : (
                  <div className="registrations-list">
                    {offeringRegistrations.map((registration) => (
                      <div key={registration.id} className="registration-card">
                        <div className="registration-info">
                          <h4>{registration.studentName}</h4>
                          <p>{registration.studentEmail}</p>
                        </div>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(registration.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          // Show all registrations grouped by offering
          filteredOfferings.length === 0 ? (
            <p className="empty-state">No course offerings available for the selected filter.</p>
          ) : (
            <div className="all-registrations">
              {filteredOfferings.map((offering) => {
                const offeringRegistrations = getRegistrationsForOffering(offering.id);
                if (offeringRegistrations.length === 0) return null;
                return (
                  <div key={offering.id} className="offering-group">
                    <h3>{getOfferingDisplayName(offering)}</h3>
                    <div className="registrations-list">
                      {offeringRegistrations.map((registration) => (
                        <div key={registration.id} className="registration-card">
                          <div className="registration-info">
                            <h4>{registration.studentName}</h4>
                            <p>{registration.studentEmail}</p>
                          </div>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => handleDelete(registration.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filteredOfferings.every(o => getRegistrationsForOffering(o.id).length === 0) && (
                <p className="empty-state">No student registrations found.</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StudentRegistrations;

