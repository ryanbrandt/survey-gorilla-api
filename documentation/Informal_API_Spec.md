## User

`GET /User/{id}` - get user by id

`PATCH /User/{id}`- update mutable user fields by id

`GET /User/{id}/Survey` - get user owned surveys

No POST, PUT or DELETE-- identity service through AWS Cognito

- Provides us with sub (user id)
- Exposes a post-registration trigger, which we can hook up a lambda to for adding users to our DB
- Exposes a sync trigger on user remove, which we can hook up a lambda for removing users from our db (if we want to do this)

## Survey

`POST /Survey` - create survey, optionally incude questions

`GET /Survey/{id}` - get survey by id, optional ?include=questions to also retrieve questions

`PATCH /Survey/{id}` - update mutable survey fields by id

`DELETE /Survey/{id}` - delete survey by id

`GET /Survey/{id}/Question` - get only survey questions

`POST /Survey/{id}/Question` - create a list of survey questions (upserts questions and creates survey_questions resources)

`PUT /Survey/{id}/Question` - update list of survey questions (full replacement)

`POST /Survey/{id}/Answer` -> create a list of survey question answers

## Question

`POST /Question` - create question (independant of a survey)
`DELETE /Question/{id}` - delete question (independant of a survey, but cascades to survey_questions)

No PUT/PATCH

- Would result in breaking changes with component_schema_id/component_configuration if question has answers
- Could be solved with versioning, but that could be considered a future problem

## Answer

`POST /Answer/_search` - search answers by user, question, survey
