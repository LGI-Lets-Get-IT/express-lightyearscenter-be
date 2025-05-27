const db = require("../models/index");
const UserRepository = require("../repositories/user.repositories")(db);

function getUserGroupAndPermissions(currentUserData) {
  console.log("CURRENT USERDATA", currentUserData);
  // Map over the groups and extract the group names
  currentUserData.groups = currentUserData?.groups?.map((group) => {
    // Map over the group permissions and extract the permission names
    currentUserData.permissions = group.group_perms?.map((perm) => perm.name);
    return group.name;
  });

  // Combine the group permissions and user permissions into a set to remove duplicates
  currentUserData.permissions = [
    ...new Set([
      ...currentUserData.permissions,
      ...currentUserData.user_perms?.map((perm) => perm.name),
    ]),
  ];

  // Delete the user permissions from the user object
  delete currentUserData.user_perms;

  return currentUserData;
}

const getUserByIdentifier = async (identifier, isShowGroupAndPermissions) => {
  let user = await UserRepository.findOneByIdentifierWithGroupAndPermissions(
    identifier,
    isShowGroupAndPermissions
  );

  user = user?.get({ plain: true });

  if (isShowGroupAndPermissions) {
    user = getUserGroupAndPermissions(user);
  }

  return user;
};

const getUserByEmail = async (email) => {
  const user = await UserRepository.findOneByEmail(email);

  return user;
};

const updateUserDataById = async (userId, data, transaction) => {
  const updateData = await UserRepository.updateUserById(
    userId,
    data,
    transaction
  );

  if (!updateData) return false;

  return true;
};

const createUser = async (data, transaction) => {
  const user = await UserRepository.createUser(data, transaction);

  if (!user) return false;

  return user;
};

module.exports = {
  getUserByIdentifier,
  // getUserByRefreshToken,
  // getUserByUsername,
  // getUserByUsernameWithRoles,
  getUserByEmail,
  updateUserDataById,
  createUser,
};
