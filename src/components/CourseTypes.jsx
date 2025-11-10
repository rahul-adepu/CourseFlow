import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './CourseTypes.css';

const CourseTypes = () => {
  const { courseTypes, addCourseType, updateCourseType, deleteCourseType } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});

  const validate = (name) => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Course type name is required';
    } else if (courseTypes.some(ct => ct.name.toLowerCase() === name.toLowerCase().trim() && ct.id !== editingId)) {
      newErrors.name = 'Course type with this name already exists';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData.name);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingId) {
      updateCourseType(editingId, formData.name.trim());
      setEditingId(null);
    } else {
      addCourseType(formData.name.trim());
    }
    setFormData({ name: '' });
    setIsAdding(false);
    setErrors({});
  };

  const handleEdit = (courseType) => {
    setFormData({ name: courseType.name });
    setEditingId(courseType.id);
    setIsAdding(true);
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({ name: '' });
    setIsAdding(false);
    setEditingId(null);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course type? This will also delete associated course offerings and registrations.')) {
      deleteCourseType(id);
    }
  };

  return (
    <div className="course-types">
      <div className="section-header">
        <h2>Course Types</h2>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + Add Course Type
          </button>
        )}
      </div>

      {isAdding && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Course Type' : 'Add New Course Type'}</h3>
          <div className="form-group">
            <label htmlFor="courseTypeName">Course Type Name *</label>
            <input
              type="text"
              id="courseTypeName"
              value={formData.name}
              onChange={(e) => {
                setFormData({ name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="e.g., Individual, Group, Special"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
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
        {courseTypes.length === 0 ? (
          <p className="empty-state">No course types found. Add one to get started.</p>
        ) : (
          <div className="card-list">
            {courseTypes.map((courseType) => (
              <div key={courseType.id} className="card">
                <div className="card-content">
                  <h3>{courseType.name}</h3>
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => handleEdit(courseType)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(courseType.id)}
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

export default CourseTypes;

