package br.uff.graduatesapi.error

import org.springframework.http.HttpStatus

enum class Errors(val message: String, val responseMessage: String, val errorCode: HttpStatus) {
    CANT_UPDATE_COURSES(
        "Error updating courses",
        "Erro ao atualizar cursos.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_CREATE_ADVISOR("Error creating advisor", "Erro ao criar orientador.", HttpStatus.INTERNAL_SERVER_ERROR),
    CANT_UPDATE_USER(
        "Error updating user", "Erro ao atualizar usuário.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    COURSE_NOT_FOUND("Course not found", "Curso não encontrado.", HttpStatus.NOT_FOUND),
    CANT_DELETE_RESET_PASSWORD_CODE(
        "Error deleting reset password code",
        "Erro ao deletar código de recuperação de senha.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_UPDATE_USER_PASSWORD(
        "Error updating user password", "Erro ao atualizar senha do usuário.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    RESET_PASSWORD_CODE_NOT_FOUND(
        "Reset password code not found", "Código de recuperação de senha não encontrado.", HttpStatus.NOT_FOUND
    ),

    CANT_FIND_RESET_PASSWORD_CODE(
        "Cant find reset password code",
        "Erro ao encontrar código de recuperação de senha.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),

    EMAIL_NOT_SENT("E-mail not sent", "Erro ao enviar e-mail.", HttpStatus.INTERNAL_SERVER_ERROR),

    CANT_CREATE_USER(
        "Error creating user", "Erro ao tentar criar o usuário. Tente novamente.", HttpStatus.INTERNAL_SERVER_ERROR
    ),

    RESET_PASSWORD_CODE_IS_EXPIRED(
        "Reset password code is expired",
        "Código de recuperação de senha expirado. Gere um novo código.",
        HttpStatus.UNPROCESSABLE_ENTITY
    ),

    CANT_CREATE_PASSWORD_CODE(
        "Error creating password code",
        "Erro ao criar código de recuperação de senha. Tente novamente.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),

    CANT_RETRIEVE_CNPQ_LEVEL(
        "Cant retrieve CNPQ level", "Erro ao retornar nível CNPQ.", HttpStatus.INTERNAL_SERVER_ERROR
    ),

    CANT_CREATE_POST_DOCTORATE(
        "Error creating post doctorate",
        "Erro ao tentar criar o pós-doutorado. Tente novamente.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_UPDATE_EMAIL(
        "Error updating e-mail", "Erro ao atualizar e-mail. Tente novamente.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    UNABLE_TO_UPDATE_CURRENT_ROLE(
        "Error updating current role",
        "Erro ao atualizar papel atual. Tente novamente.",
        HttpStatus.UNPROCESSABLE_ENTITY
    ),
    EMAIL_IN_USE("E-mail already in use", "E-mail em uso.", HttpStatus.UNPROCESSABLE_ENTITY),

    CANT_DELETE_PASSWORD_CODE(
        "Error deleting password code",
        "Erro ao deletar código de recuperação de senha.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    USER_NOT_FOUND("User not found", "Usuário não encontrado.", HttpStatus.NOT_FOUND),

    CANT_RETRIEVE_USERS(
        "Cant retrieve users", "Erro ao retornar usuários. Tente novamente.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_RETRIEVE_USER(
        "Cant retrieve user", "Erro ao retornar usuário. Tente novamente.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    UNAUTHORIZED(
        "Username or password is wrong.", "Usuário ou senha incorretos. Tente novamente.", HttpStatus.UNAUTHORIZED
    ),
    USER_NOT_ALLOWED("User is not allowed", "Usuário não é permitido.", HttpStatus.FORBIDDEN),


    CANT_RETRIEVE_GRADUATES(
        "Cant retrieve graduates", "Erro ao retornar os egressos. Tente novamente", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    GRADUATE_NOT_FOUND("Graduate not found", "Egresso não encontrado", HttpStatus.NOT_FOUND), CANT_CREATE_GRADUATE(
        "Cant create graduates", "Erro ao tentar criar egresso. Tente novamente", HttpStatus.INTERNAL_SERVER_ERROR
    ),


    INSTITUTION_TYPE_NOT_FOUND(
        "Institution type not found", "Tipo da instituição não encontrado.", HttpStatus.NOT_FOUND
    ),
    CANT_RETRIEVE_INSTITUTION_TYPES(
        "Cant retrieve institution types", "Erro ao retornar tipos de instituição.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_RETRIEVE_INSTITUTION_TYPE(
        "Cant retrieve institution type", "Erro ao retornar tipo de instituição.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_DELETE_INSTITUTION_TYPE(
        "Error deleting institution type", "Erro ao excluir tipo de instituição.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_CREATE_INSTITUTION_TYPE(
        "Error creating institution type", "Erro ao criar tipo de instituição.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_UPDATE_INSTITUTION_TYPE(
        "Error updating institution type", "Erro ao atualizar tipo de instituição.", HttpStatus.INTERNAL_SERVER_ERROR
    ),

    CANT_GET_CURRENT_HISTORIES(
        "Error trying to get last work history",
        "Erro ao tentar retornar último histórico de trabalho.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_CREATE_INSTITUTION(
        "Error creating institution", "Erro ao criar instituição.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    INSTITUTION_NOT_FOUND("Institution not found", "Instituição não encontrada.", HttpStatus.NOT_FOUND),

    CANT_CREATE_WORK_HISTORY(
        "Error creating work history", "Erro ao criar histórico de trabalho.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    WORK_HISTORY_NOT_FOUND(
        "Work history not found",
        "Histórico de trabalho não encontrado.",
        HttpStatus.NOT_FOUND
    ),
    CNPQSCHOLARSHIP_NOT_FOUND(
        "CNPQ scholarship not found",
        "Bolsa CNPQ não encontrada.",
        HttpStatus.NOT_FOUND
    ),
    CANT_CREATE_CNPQSCHOLARSHIP(
        "Error creating CNPQ scholarship", "Erro ao criar bolsa CNPQ.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_RETRIEVE_CNPQ_LEVELS(
        "Cant retrieve CNPQ levels", "Erro ao retornar níveis CNPQ.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_DELETE_CNPQ_LEVEL(
        "Error deleting CNPQ level", "Erro ao excluir nível CNPQ.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_CREATE_CNPQ_LEVEL(
        "Error creating CNPQ level",
        "Erro ao criar nível CNPQ.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CNPQ_LEVEL_NOT_FOUND(
        "CNPQ level not found",
        "Nível CNPQ não encontrado.",
        HttpStatus.NOT_FOUND
    ),
    CANT_UPDATE_CNPQ_LEVEL(
        "Error updating CNPQ level", "Erro ao atualizar nível CNPQ.", HttpStatus.INTERNAL_SERVER_ERROR
    ),


    CANT_RETRIEVE_CI_PROGRAMS(
        "Cant retrieve CI programs", "Erro ao retornar programas do IC.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_RETRIEVE_CI_PROGRAM_BY_INITIALS(
        "Cant retrieve CI program by initials",
        "Erro ao retornar programa do IC pelas iniciais.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CI_PROGRAM_NOT_FOUND(
        "CI program was not found", "Programa do IC não encontrado. Tente novamente.", HttpStatus.NOT_FOUND
    ),
    CANT_DELETE_CI_PROGRAM(
        "Error deleting CI program", "Erro ao excluir programa do IC.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_CREATE_CI_PROGRAM(
        "Error creating CI program", "Erro ao criar programa do IC.", HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_UPDATE_CI_PROGRAM(
        "Error updating CI program", "Erro ao atualizar programa do IC.", HttpStatus.INTERNAL_SERVER_ERROR
    ),

    CANT_RETRIEVE_COURSES(
        "Cant retrieve courses", "Erro ao retornar cursos.", HttpStatus.INTERNAL_SERVER_ERROR
    ),

    UNABLE_TO_INSERT_UPDATE_HISTORY_STATUS(
        "Unable to update or insert history status",
        "Não foi possível atualizar o status do histórico. Tente novamente.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),

    CANT_RETRIEVE_EMAILS(
        "Cant retrieve e-mails",
        "Erro ao recuperar e-mails.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_DELETE_EMAIL(
        "Cant delete e-mail",
        "Erro ao deletar e-mail.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    EMAIL_NOT_FOUND("E-mail not found", "E-mail não encontrado.", HttpStatus.NOT_FOUND), CANT_DELETE_AN_ACTIVE_EMAIL(
        "Cant delete an active e-mail", "Não é possível deletar um e-mail ativo.", HttpStatus.FORBIDDEN
    ),
    CANT_CREATE_EMAIL(
        "Error creating e-mail",
        "Erro ao criar e-mail.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_DEACTIVATE_EMAILS(
        "Error deactivating e-mails", "Erro ao desativar e-mails.", HttpStatus.INTERNAL_SERVER_ERROR
    ),

    INVALID_DATA("Invalid data", "Dados inválidos.", HttpStatus.UNPROCESSABLE_ENTITY),


    POST_DOCTORATE_NOT_FOUND("Post Doctorate not found", "Pós-doutorado não encontrado.", HttpStatus.NOT_FOUND),

    FILE_EMPTY("File is empty", "Arquivo está vazio.", HttpStatus.BAD_REQUEST),

    ADVISOR_NOT_FOUND(
        "Advisor not found",
        "Orientador não encontrado.",
        HttpStatus.NOT_FOUND
    ),
    CANT_CREATE_COURSE(
        "Error creating course",
        "Erro ao criar curso.",
        HttpStatus.UNPROCESSABLE_ENTITY
    ),
    CANT_CREATE_COURSES(
        "Error creating courses",
        "Erro ao criar cursos.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_CREATE_POST_DOCTORATE_INSTITUTION(

        "Error creating post doctorate institution",
        "Erro ao criar instituição de pós-doutorado.",
        HttpStatus.INTERNAL_SERVER_ERROR
    ),
    CANT_RETRIEVE_ADVISOR("Cant retrieve advisor", "Erro ao retornar orientador.", HttpStatus.INTERNAL_SERVER_ERROR);

}