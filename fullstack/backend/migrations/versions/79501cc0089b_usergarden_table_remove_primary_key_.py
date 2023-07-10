"""usergarden table remove primary key from user and garden

Revision ID: 79501cc0089b
Revises: a3f8bddc08ed
Create Date: 2023-06-09 15:22:55.032862

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '79501cc0089b'
down_revision = 'a3f8bddc08ed'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('UserGardens',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('garden_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['garden_id'], ['garden.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('usergardens')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('usergardens',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('garden_id', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['garden_id'], ['garden.id'], name='usergardens_ibfk_1'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='usergardens_ibfk_2'),
    sa.PrimaryKeyConstraint('id', 'user_id', 'garden_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.drop_table('UserGardens')
    # ### end Alembic commands ###