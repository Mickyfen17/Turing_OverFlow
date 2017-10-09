
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('questions', (table) => {
      table.string('user_img');
    }),

    knex.schema.table('answers', (table) => {
      table.string('user_img');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('questions', (table) => {
      table.dropColumn('user_img');
    }),
    knex.schema.table('answers', (table) => {
      table.dropColumn('user_img');
    }),
  ]);
};
