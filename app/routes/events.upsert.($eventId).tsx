import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import {
  LoaderFunctionArgs,
  json,
  redirect,
  type ActionFunctionArgs,
} from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'

import { getUserId } from '~/services/auth.server'
import {
  createEvent,
  getEvent,
  updateEvent,
} from '~/services/events/events.server'

import { eventCreateSchema, eventUpdateSchema } from '~/services/events/events'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { commitSession, getSession } from '~/lib/sessions'

export async function loader(args: LoaderFunctionArgs) {
  const userId = await getUserId(args)

  if (userId === 'GUEST') {
    const { request } = args
    const url = new URL(request.url)
    const redirectUrl = `/sign-in?redirect_url=${encodeURIComponent(
      url.pathname + '?cacheBust=' + new Date().getTime(),
    )}`
    console.log(`🚀 ~ loader ~ redirectUrl:`, redirectUrl)
    return redirect(redirectUrl, { status: 302 })
  }

  const { eventId } = args.params
  if (!eventId) {
    return {
      userId,
      event: null,
      eventId,
    }
  }
  const event = await getEvent({ userId, id: eventId })
  const data = { userId, event, eventId }
  return json(data)
}

export async function action(args: ActionFunctionArgs) {
  const { request } = args
  let { eventId } = args.params
  const schema = eventId ? eventUpdateSchema : eventCreateSchema
  const userId = await getUserId(args)
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return json(submission.reply())
  }

  try {
    const session = await getSession(args.request.headers.get('Cookie'))
    if (eventId) {
      await updateEvent({ ...submission.value, userId, id: eventId })
      session.flash('info', 'updated')
      // return redirect(`/event/${eventId}`)
    } else {
      const { id } = await createEvent({ ...submission.value, userId })
      eventId = id
      session.flash('info', 'created')
      // return redirect(`/event/${newEvent.id}`)
    }
    // session.flash('info', 'Deleted')
    return redirect(`/event/${eventId}`, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } catch (error) {
    let message = 'Failed to save. Please try again later.'
    if (error instanceof PrismaClientKnownRequestError) {
      message = (error.meta?.reason as string) || 'Database error'
    }
    console.log(`🚀 ~ action ~ error:`, error)
    return json(
      submission.reply({
        formErrors: [message],
      }),
    )
  }
}

export default function UpsertEvent() {
  const data = useLoaderData<typeof loader>()
  const lastResult = useActionData<typeof action>()

  let schema: typeof eventCreateSchema | typeof eventUpdateSchema =
    eventUpdateSchema
  if (!data.eventId) {
    schema = eventCreateSchema
  }
  const [form, fields] = useForm({
    defaultValue: data.event || {},
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })

  const labelProps = {
    className:
      'block label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2',
  }
  const errorProps = {
    className: 'bg-error text-error-content mt-2 p-2 rounded-md block w-fit',
  }
  type fieldKeys = keyof typeof fields
  const getErrorProps = (fieldName: fieldKeys) => {
    return fields[fieldName].errors ? errorProps : {}
  }
  const isNew = !data.eventId

  return (
    <>
      <h1 className="not-prose font-extrabold text-2xl text-base-content">
        {isNew ? 'Create event' : 'Update event'}
      </h1>
      <div className="prose">
        <Form method="post" {...getFormProps(form)}>
          <div>{form.errors}</div>
          {isNew ? null : (
            <input {...getInputProps(fields?.id, { type: 'hidden' })} />
          )}
          <div>
            <label {...labelProps} htmlFor={fields.title.id}>
              Title
            </label>
            <input
              {...getInputProps(fields.title, { type: 'text' })}
              className="input-bordered bg-base-200 focus:outline-secondary-focus block w-full p-1"
            />
            <div {...getErrorProps('title')} id={fields.title.errorId}>
              {fields.title.errors}
            </div>
          </div>
          <div>
            <label {...labelProps} htmlFor={fields.body.id}>
              Description
            </label>
            <textarea
              rows={10}
              className="textarea textarea-bordered bg-base-200 focus:outline-secondary-focus w-full"
              {...getTextareaProps(fields.body)}
            />
            <div {...getErrorProps('body')} id={fields.body.errorId}>
              {fields.body.errors}
            </div>
          </div>
          <button className="btn btn-lg btn-secondary btn-block mt-4">
            {isNew ? 'Create' : 'Update'}
          </button>
        </Form>
      </div>
    </>
  )
}
