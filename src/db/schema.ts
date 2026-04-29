import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
})

export const teams = pgTable('teams', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  teamName: text('team_name').notNull(),
  sport: text('sport').notNull(),
  rosterSize: integer('roster_size').notNull(),
  paymentStatus: text('payment_status', { enum: ['unpaid', 'paid'] }).notNull().default('unpaid'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
})

export const players = pgTable('players', {
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
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
})

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => teams.id),
  stripeSessionId: text('stripe_session_id').notNull(),
  mpcOrderId: text('mpc_order_id'),
  status: text('status', { enum: ['pending_payment', 'paid', 'sent_to_printer'] }).notNull().default('pending_payment'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
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
