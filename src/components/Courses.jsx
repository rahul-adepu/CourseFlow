import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './CourseTypes.css';

const Courses = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});

  const validate = (name) => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Course name is required';
    } else if (courses.some(c => c.name.toLowerCase() === name.toLowerCase().trim() && c.id !== editingId)) {
      newErrors.name = 'Course with this name already exists';
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
      updateCourse(editingId, formData.name.trim());
      setEditingId(null);
    } else {
      addCourse(formData.name.trim());
    }
    setFormData({ name: '' });
    setIsAdding(false);
    setErrors({});
  };

  const handleEdit = (course) => {
    setFormData({ name: course.name });
    setEditingId(course.id);
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
    if (window.confirm('Are you sure you want to delete this course? This will also delete associated course offerings and registrations.')) {
      deleteCourse(id);
    }
  };

  return (
    <div className="course-types">
      <div className="section-header">
        <h2>Courses</h2>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + Add Course
          </button>
        )}
      </div>

      {isAdding && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Course' : 'Add New Course'}</h3>
          <div className="form-group">
            <label htmlFor="courseName">Course Name *</label>
            <input
              type="text"
              id="courseName"
              value={formData.name}
              onChange={(e) => {
                setFormData({ name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="e.g., Hindi, English, Urdu"
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
        {courses.length === 0 ? (
          <p className="empty-state">No courses found. Add one to get started.</p>
        ) : (
          <div className="card-list">
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="card-content">
                  <h3>{course.name}</h3>
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(course.id)}
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

export default Courses;

