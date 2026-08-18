/**
 * Serialize a Trip document into the travel-request shape the frontend
 * consumes. `employee` and `approver` must be populated for best output.
 */
export const serializeTrip = (t) => {
  if (!t) return null;
  const emp = t.employee || {};
  const lastApproval = (t.approvals || []).slice(-1)[0] || null;
  const budget = t.estimatedCost ?? t.estimatedBudget ?? 0;
  return {
    id: t._id,
    ref: t.ref || `TR-${String(t._id).slice(-6).toUpperCase()}`,
    title: t.title || `${t.from ? `${t.from} → ` : ''}${t.destination}`.trim(),
    destination: t.destination,
    from: t.from || '',
    purpose: t.purpose,
    client: t.client || '',
    project: t.project || '',
    costCenter: t.costCenter || '',
    travellers: t.travellers || 1,
    startDate: t.startDate,
    endDate: t.endDate,
    estimatedCost: budget,
    flight: t.flight || null,
    hotel: t.hotel || null,
    policy: t.policy || { flight: 'none', hotel: 'none', violation: false },
    timeline: t.timeline || [],
    status: t.status,
    rejectionReason: t.rejectionReason || '',
    cancelledBy: t.cancelledBy || '',
    cancelReason: t.cancelReason || '',
    employee: emp.name
      ? {
          id: emp._id,
          name: emp.name,
          email: emp.email,
          department: emp.department || '',
          designation: emp.designation || '',
          grade: emp.grade || '',
          employeeId: emp.employeeId || '',
        }
      : null,
    approver: t.approver && t.approver.name
      ? { id: t.approver._id, name: t.approver.name, email: t.approver.email }
      : null,
    approval: lastApproval
      ? { decision: lastApproval.decision, comment: lastApproval.comment || '', at: lastApproval.date }
      : null,
    company: t.company?.name || (typeof t.company === 'string' ? t.company : null),
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
};

export const serializeTripList = (trips) => trips.map(serializeTrip);
