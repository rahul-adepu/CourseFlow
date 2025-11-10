import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './CourseTypes.css';

const CourseOfferings = () => {
  const { 
    courseOfferings, 
    courses, 
    courseTypes, 
    addCourseOffering, 
    updateCourseOffering, 
    deleteCourseOffering,
    getOfferingDisplayName 
  } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ courseId: '', courseTypeId: '' });
  const [errors, setErrors] = useState({});

  const validate = (courseId, courseTypeId) => {
    const newErrors = {};
    if (!courseId) {
      newErrors.courseId = 'Please select a course';
    }
    if (!courseTypeId) {
      newErrors.courseTypeId = 'Please select a course type';
    }
    if (courseId && courseTypeId) {
      const exists = courseOfferings.some(
        co => co.courseId === parseInt(courseId) && 
               co.courseTypeId === parseInt(courseTypeId) && 
               co.id !== editingId
      );
      if (exists) {
        newErrors.general = 'This course offering already exists';
      }
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData.courseId, formData.courseTypeId);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingId) {
      updateCourseOffering(editingId, formData.courseId, formData.courseTypeId);
      setEditingId(null);
    } else {
      addCourseOffering(formData.courseId, formData.courseTypeId);
    }
    setFormData({ courseId: '', courseTypeId: '' });
    setIsAdding(false);
    setErrors({});
  };

  const handleEdit = (offering) => {
    setFormData({ 
      courseId: offering.courseId.toString(), 
      courseTypeId: offering.courseTypeId.toString() 
    });
    setEditingId(offering.id);
    setIsAdding(true);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({ courseId: '', courseTypeId: '' });
    setIsAdding(false);
    setEditingId(null);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course offering? This will also delete associated student registrations.')) {
      deleteCourseOffering(id);
    }
  };

  return (
    <div className="course-types">
      <div className="section-header">
        <h2>Course Offerings</h2>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + Add Course Offering
          </button>
        )}
      </div>

      {isAdding && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Course Offering' : 'Add New Course Offering'}</h3>
          {errors.general && <span className="error-message">{errors.general}</span>}
          <div className="form-group">
            <label htmlFor="courseType">Course Type *</label>
            <select
              id="courseType"
              value={formData.courseTypeId}
              onChange={(e) => {
                setFormData({ ...formData, courseTypeId: e.target.value });
                if (errors.courseTypeId) setErrors({ ...errors, courseTypeId: '' });
              }}
              className={errors.courseTypeId ? 'error' : ''}
            >
              <option value="">Select a course type</option>
              {courseTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
            {errors.courseTypeId && <span className="error-message">{errors.courseTypeId}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <select
              id="course"
              value={formData.courseId}
              onChange={(e) => {
                setFormData({ ...formData, courseId: e.target.value });
                if (errors.courseId) setErrors({ ...errors, courseId: '' });
              }}
              className={errors.courseId ? 'error' : ''}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            {errors.courseId && <span className="error-message">{errors.courseId}</span>}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update' : 'Add'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="list-container">
        {courseOfferings.length === 0 ? (
          <p className="empty-state">No course offerings found. Add one to get started.</p>
        ) : (
          <div className="card-list">
            {courseOfferings.map((offering) => (
              <div key={offering.id} className="card">
                <div className="card-content">
                  <h3>{getOfferingDisplayName(offering)}</h3>
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => handleEdit(offering)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(offering.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseOfferings;

