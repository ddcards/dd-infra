import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  teamName: text('team_name').notNull(),
  sport: text('sport').notNull(),
  rosterSize: integer('roster_size').notNull(),
  paymentStatus: text('payment_status', { enum: ['unpaid', 'paid'] }).notNull().default('unpaid'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id),
  name: text('name').notNull(),
  jerseyNumber: text('jersey_number').notNull(),
  position: text('position').notNull(),
  rawImageUrl: text('raw_image_url'),
  cleanImageUrl: text('clean_image_url'),
  proofImageUrl: text('proof_image_url'),
  printImageUrl: text('print_image_url'),
  status: text('status', { enum: ['empty', 'uploaded', 'processing', 'proof_ready', 'approved'] }).notNull().default('empty'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id),
  stripeSessionId: text('stripe_session_id').notNull(),
  mpcOrderId: text('mpc_order_id'),
  status: text('status', { enum: ['pending_payment', 'paid', 'sent_to_printer'] }).notNull().default('pending_payment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
}))

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  teams: many(teams),
}))
