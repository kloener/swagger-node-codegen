const express = require('express');
const {{camelCase service_name}} = require('../services/{{service_name}}');

const router = new express.Router();

{{#each endpoint}}
  {{#each this.path}}
    {{#validMethod @key}}
/**
 {{#each ../descriptionLines}}
 * {{{this}}}
 {{/each}}
 */
router.{{@key}}('{{../../subresource}}', async (req, res, next) => {
  const options = {
    {{#each ../parameters}}
      {{#equal this.in "query"}}
    {{../name}}: req.query.{{../name}}{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#equal this.in "path"}}
    {{../name}}: req.params.{{../name}}{{#unless @last}},{{/unless}}
      {{/equal}}
      {{#match @../key "(post|put)"}}
        {{#equal ../in "body"}}
    {{../name}}: req.body.{{../name}}{{#unless @last}},{{/unless}}
        {{/equal}}
      {{/match}}
    {{/each}}
  };

  try {
    const result = await {{camelCase ../../../service_name}}.{{../operationId}}(options);
    {{#ifNoSuccessResponses ../responses}}
    res.status(200).send(result.data);
    {{else}}
    res.status(result.code || 200).send(result.data);
    {{/ifNoSuccessResponses}}
  } catch (err) {
    {{#ifNoErrorResponses ../responses}}
    return res.status(500).send({
      status: 500,
      message: 'Server Error'
    });
    {{else}}
    return res.status(err.code).send({
      status: err.code,
      message: err.message
    });
    {{/ifNoErrorResponses}}
  }
});

    {{/validMethod}}
  {{/each}}
{{/each}}
module.exports = router;
