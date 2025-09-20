function EmployeeRepository(db) {
  const findAll = () => {
    return db.employees.findAll({
      attributes: [
        "id",
        "fullName",
        "phoneNumber",
        "email",
        [db.sequelize.col(`role.name`), "roleName"],
        "isActive",
      ],
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: [],
        },
      ],
    });
  };

  const findAllByRoleId = (roleId) => {
    return db.employees.findAll({
      where: {
        roleId,
      },
      attributes: [
        "id",
        "fullName",
        "phoneNumber",
        "email",
        [db.sequelize.col(`role.name`), "roleName"],
        "isActive",
      ],
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: [],
        },
      ],
    });
  };

  const findPasswordById = (id) => {
    return db.employees.findOne({
      attributes: ["password"],
      where: {
        id,
      },
    });
  };

  const findAllEmployeeWithSchedulesByRoleId = (roleIds) => {
    return db.employees.findAll({
      attributes: ["id", "fullName"],
      where: {
        roleId: roleIds,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["id", "name"],
        },
        {
          model: db.picAvailabilities,
          as: "schedules",
        },
      ],
    });
  };

  const findAllBySchedules = (roleId, appointmentDay, startTime, endTime) => {
    return db.employees.findAll({
      where: {
        roleId,
      },
      attributes: [
        "id",
        "fullName",
        [db.sequelize.col(`role.name`), "roleName"],
      ],
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: [],
        },
        {
          model: db.picAvailabilities,
          as: "schedules",
          attributes: {
            exclude: ["employeeId", "employee_id", "createdAt", "updatedAt"],
          },
          where: {
            availableDays: {
              [db.Sequelize.Op.overlap]: [appointmentDay],
            },
            // availableStartTime: {
            //   [db.Sequelize.Op.lte]: startTime,
            // },
            // availableEndTime: {
            //   [db.Sequelize.Op.gte]: endTime,
            // },
          },
        },
      ],
    });
  };

  const findOneWithSchedulesById = (id) => {
    return db.employees.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["id", "name"],
        },
        {
          model: db.picAvailabilities,
          as: "schedules",
        },
      ],
    });
  };

  const findOneById = (id) => {
    return db.employees.findOne({
      attributes: [
        "id",
        "roleId",
        "schoolId",
        "fullName",
        "phoneNumber",
        "email",
        "isActive",
        [db.sequelize.col("role.name"), "roleName"],
        [db.sequelize.col(`school.name`), "schoolName"],
        "createdAt",
        "updatedAt",
      ],
      where: {
        id,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["name"],
        },
        {
          model: db.schools,
          as: "school",
          attributes: [],
        },
      ],
    });
  };

  const findOneByEmail = (email) => {
    return db.employees.findOne({
      // raw: true,
      where: {
        email,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
  };

  const findOneByRefreshToken = (token) => {
    return db.employees.findOne({
      where: {
        refreshToken: token,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
  };
  const create = (bodyData, transaction) => {
    return db.employees.create(bodyData, { transaction });
  };

  const updateById = (id, bodyData, transaction) => {
    return db.employees.update(
      bodyData,
      {
        where: {
          id: id,
        },
      },
      { transaction }
    );
  };

  const deleteByIds = (ids, transaction) => {
    return db.employees.destroy(
      {
        where: {
          id: ids,
        },
      },
      { transaction }
    );
  };

  const checkEmployeeAppointment = async (
    employeeId,
    appointmentDate,
    startTime,
    endTime
  ) => {
    // Convert date string to proper date object
    const dateObj = new Date(appointmentDate);

    // Create proper datetime objects for the time range
    const startDateTime = new Date(`${appointmentDate}T${startTime}`);
    const endDateTime = new Date(`${appointmentDate}T${endTime}`);

    console.log("=== CHECKING EMPLOYEE APPOINTMENT ===");
    console.log("Input parameters:", {
      employeeId,
      appointmentDate,
      startTime,
      endTime,
    });
    console.log("Converted to:", {
      dateObj,
      startDateTime,
      endDateTime,
    });
    console.log("Date validation:", {
      isValidDate: !isNaN(dateObj.getTime()),
      isValidStartTime: !isNaN(startDateTime.getTime()),
      isValidEndTime: !isNaN(endDateTime.getTime()),
    });

    const existingAppointment = await db.appointments.findOne({
      where: {
        picId: employeeId,
        appointmentDate: dateObj,
        bookingTimeStart: {
          [db.Sequelize.Op.lt]: endDateTime,
        },
        bookingTimeEnd: {
          [db.Sequelize.Op.gt]: startDateTime,
        },
      },
      logging: console.log, // This will show the actual SQL query
    });

    const hasAppointment = !!existingAppointment;
    console.log(
      `Employee ${employeeId} has appointment on ${appointmentDate}:`,
      hasAppointment
    );

    if (existingAppointment) {
      console.log("Found existing appointment:", {
        id: existingAppointment.id,
        picId: existingAppointment.picId,
        appointmentDate: existingAppointment.appointmentDate,
        bookingTimeStart: existingAppointment.bookingTimeStart,
        bookingTimeEnd: existingAppointment.bookingTimeEnd,
      });
    } else {
      // Debug: Let's see all appointments for this employee on this date
      const allAppointmentsOnDate = await db.appointments.findAll({
        where: {
          picId: employeeId,
          appointmentDate: dateObj,
        },
        logging: console.log,
      });
      console.log(
        `All appointments for employee ${employeeId} on ${appointmentDate}:`,
        allAppointmentsOnDate.length
      );
      if (allAppointmentsOnDate.length > 0) {
        allAppointmentsOnDate.forEach((apt) => {
          console.log(
            `  - Appointment: ${apt.bookingTimeStart} to ${apt.bookingTimeEnd}`
          );
        });
      }
    }

    return hasAppointment;
  };

  return {
    findAll,
    findAllByRoleId,
    findAllEmployeeWithSchedulesByRoleId,
    findAllBySchedules,
    findOneWithSchedulesById,
    findOneById,
    findOneByEmail,
    findOneByRefreshToken,
    findPasswordById,
    create,
    updateById,
    deleteByIds,
    checkEmployeeAppointment,
  };
}

module.exports = EmployeeRepository;
