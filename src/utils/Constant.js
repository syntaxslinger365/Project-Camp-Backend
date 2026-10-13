export const UserRolesEnum = {
    ADMIN:"admin",
    PROJECT_ADMIN:"project_admin",
    MEMBER:"member"

}

export const AvailableUserRole=Object.values(UserRolesEnum);
// this will return an array containing values of UserRolesEnum  value like admin,project_admin,member

export const TaskStatusEnum={
    TODO:"todo",
    IN_PROGRESS:"in_progress",
    DONE:"done"
}

export const AvailableTaskStatus=Object.values(TaskStatusEnum);