import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text
} from '@chakra-ui/react'

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  message,
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmColorScheme = 'red'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {message || (
            <>
              Are you sure you want to delete{' '}
              <Text as='span' fontWeight='bold'>
                {itemName}
              </Text>
              ?
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            {cancelText}
          </Button>
          <Button colorScheme={confirmColorScheme} onClick={onConfirm}>
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConfirmModal
