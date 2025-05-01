
export default function (prisma) {
  return async function (req, res) {
    const { student, guardianId } = req.body
    const count = await prisma.student.count({ where: { status: 'registered' } })
    const limit = 1
    if (count < limit) {
      const newStudent = await prisma.student.create({
        data: { ...student, status: 'registered', guardianId }
      })
      await prisma.registration.create({ data: { studentId: newStudent.id, status: 'registered' } })
      res.json({ status: 'confirmed', student: newStudent })
    } else {
      const waitlisted = await prisma.student.create({
        data: { ...student, status: 'waitlisted', guardianId }
      })
      await prisma.waitlist.create({ data: { studentId: waitlisted.id } })
      res.json({ status: 'waitlisted', student: waitlisted })
    }
  }
}
